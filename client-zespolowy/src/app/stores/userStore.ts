import { makeAutoObservable, runInAction } from "mobx";
import { ChangePasswordFormValues, User, UserFormValues } from "../models/common/User";
import agent from "../api/agent";
import { store } from "./store";
import { router } from "../router/Routes";
import { AccountDetails } from "../models/onlineshop/AccountDetails";
import { Address } from "../models/onlineshop/Address";
import { toast } from "react-toastify";

export default class UserStore {
    user: User | null = null;
    accountDetails: AccountDetails | null = null;

    constructor() {
        makeAutoObservable(this);
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

    register = async (creds: UserFormValues) => {
        try {
            const user = await agent.Account.register(creds);
            store.commonStore.setToken(user.token);
            runInAction(() => {
                this.user = user;
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