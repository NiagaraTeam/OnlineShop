import { makeAutoObservable, reaction, runInAction } from "mobx";
import { ChangePasswordFormValues, User, UserFormValues } from "../models/common/User";
import agent from "../api/agent";
import { store } from "./store";
import { router } from "../router/Routes";
import { AccountDetails } from "../models/onlineshop/AccountDetails";
import { Address } from "../models/onlineshop/Address";
import { toast } from "react-toastify";
import { UserDiscount } from "../models/onlineshop/UserDiscount";
import { Order } from "../models/onlineshop/Order";

export default class UserStore {
    user: User | null = null;
    accountDetails: AccountDetails | null = null;
    users: AccountDetails[] = []
    
    itemsPerPage: string = localStorage.getItem('itemsPerPage') || "10";
    netValueFlag: string = localStorage.getItem('netValueFlag') || "true";
    NewsletterValue: boolean = this.accountDetails?.newsletter || false;

    selectedUser: AccountDetails | undefined = undefined;

    constructor() {
        makeAutoObservable(this);
        
        reaction(
            () => ({
                itemsPerPage: this.itemsPerPage,
                netValueFlag: this.netValueFlag,
            }), 
            (data) => {
                if (data.itemsPerPage) {
                    localStorage.setItem('itemsPerPage', data.itemsPerPage);
                } else {
                    localStorage.removeItem('itemsPerPage');
                }

                if (data.netValueFlag) {
                    localStorage.setItem('netValueFlag', data.netValueFlag);
                } else {
                    localStorage.removeItem('netValueFlag');
                }
            }
        )
    }

    get currentUser() {
        return this.user;
    }

    get isLoggedIn() {
        return !!this.user;
    }

    get isAdmin() {
        return this.user?.isAdmin
    }

    get hasDiscount() {
        return this.accountDetails ? this.accountDetails?.discountValue !== 0 : false;
    }

    get userDiscount() {
        return this.accountDetails ? this.accountDetails.discountValue : 0;
    }

    setItemsPerPage = (number: string) => {
        this.itemsPerPage = number;
    }

    setNetValue = (flag: boolean) => {
        if (flag)
            this.netValueFlag = "true";
        else
            this.netValueFlag = "false";
    }

    get isNetValue() {
        return (this.netValueFlag === "true");
    }

    handleVauleWithTaxCheckBox = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        this.setNetValue(isChecked);
    };
////
    setNewsletterValue = (flag: boolean) => {
        if (flag)
            this.NewsletterValue = true;
        else
            this.NewsletterValue = false;
    }

    get isNewsletterValue() {
        return (this.accountDetails?.newsletter);
    }

    handleValueOfNewsletterCheckBox = async () => {
        try {
            if (!this.user || this.isAdmin || !this.accountDetails)
                return;
    
            const newValue = !this.accountDetails.newsletter;
            const idUser = this.accountDetails.id;

            // console.log(`Current newsletter state ${idUser}: ${this.accountDetails.newsletter}`);

            const newsletterDto = { newsletter: newValue };
            await agent.Account.updateNewsletter(idUser, newsletterDto);
    
            runInAction(() => {
                this.setNewsletterValue(newValue);
                this.accountDetails!.newsletter = newValue;
            });


            // console.log(`Updated newsletter state ${idUser}: ${this.accountDetails.newsletter}`);

    
            toast.success(`Newsletter subscription ${newValue ? 'enabled' : 'disabled'}`);
        } catch (error) {
            console.log(error);
            toast.error('Failed to update newsletter subscription');
        }
    };
    

    addOrder = (order: Order) => {
        if (this.accountDetails)
            this.accountDetails.orders.push(order);
    }

    register = async (creds: UserFormValues) => {
        try {
            const user = await agent.Account.register(creds);
            store.commonStore.setToken(user.token);
            runInAction(() => {
                this.user = user;
                this.loadAccountDetails();
            });
            router.navigate('/products');
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    loginCustomer = async (creds: UserFormValues) => {
        try {
            const user = await agent.Account.loginCustomer(creds);
            user.isAdmin = false;
            store.commonStore.setToken(user.token);
            store.commonStore.clearInfo();

            runInAction(() => {
                this.user = user;
                this.loadAccountDetails();
                store.cartStore.setShowLoginForm(false);
            });
            
        } catch (error) {
            store.commonStore.setToken(null);
            console.log(error);
            throw error;
        }
    }

    loginAdmin = async (creds: UserFormValues) => {
        try {
            const user = await agent.Account.loginAdmin(creds);
            user.isAdmin = true;
            store.commonStore.setToken(user.token);
            store.commonStore.clearInfo();
            runInAction(() => {
                this.user = user;
                store.commonStore.loadAdminAppData();
            });
        } catch (error) {
            store.commonStore.setToken(null);
            console.log(error);
            throw error;
        }
    }

    logout = () => {
        store.commonStore.setToken(null);
        
        const isAdmin = this.user?.isAdmin;
        this.user = null;
        this.accountDetails = null;

        if (isAdmin)
            router.navigate('/admin/login');
        else
            router.navigate('/login');
    }

    changePassword = async (values: ChangePasswordFormValues) => {
        try {
            await agent.Account.changePassword(values);
            store.commonStore.setSuccess("Password changed");
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    
    getUser = async () => {
        try {
            const user = await agent.Account.current();
            runInAction(() => {
                this.user = user;
            });
        } catch (error) {
            console.log(error);
        }
    }

    loadUsers = async() => {
        try {
            const users = await agent.Account.getUsersAsync()
            runInAction( () => {
                this.users = users;
            })
        }
        catch(error) {
            console.log(error);
            toast.error('Failed to update users');
        } 
    }
    
    
    deleteUser = async(userId: string) => {
        try {
            await agent.Account.delete(userId)
            runInAction(() => {
                    this.users = this.users.filter((user) => user.id !== userId);
              });

        } catch(error) {
            console.log(error);
            toast.error('Failed to update users');
        } 
    }
    

    selectUser = (userId: string) => {
        this.selectedUser = this.users.find((u) => u.id === userId);
    }
    
    updateDiscount = async (userId : string, discountToUpdate: UserDiscount) => {
        try {
            await agent.Account.setUserDiscount(userId, discountToUpdate);
            runInAction(() => {
                const user = this.users.find(user => user.id === userId)
                if(user != null)
                    user.discountValue = discountToUpdate.value
            })
        } catch(error) {
            console.log(error);
            toast.error('Failed to update users');
        } 
    }
    
    loadAccountDetails = async () => {
        store.commonStore.setInitialLoading(true);
        try {
            if (!this.user || this.isAdmin)
                return;
            
            const details = await agent.Account.details(this.user.id);
            const favourites = await agent.Account.getFavouriteProducts();
            
            runInAction(() => {
                this.accountDetails = details;
                store.productStore.favouriteProducts 
                    = store.productStore.initializeDates(favourites);
            });
            
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => store.commonStore.setInitialLoading(false));
        }
    }

    updateAddress = async (userId: string, address: Address) => {
        try {
            await agent.Account.updateAddress(userId, address);
            runInAction(() => this.accountDetails!.address = address);
            toast.success('Address updated');
        } catch (error) {
            console.log(error);
            toast.error('Failed to update address');
        }
    }

}