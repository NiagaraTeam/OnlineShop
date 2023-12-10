import { makeAutoObservable, runInAction } from "mobx";
import { ChangePasswordFormValues, User, UserFormValues } from "../models/common/User";
import agent from "../api/agent";
import { store } from "./store";
import { router } from "../router/Routes";
import { AccountDetails } from "../models/onlineshop/AccountDetails";

export default class UserStore {
    user: User | null = null;
    accountDetails: AccountDetails | null = null;
    users: User[] = []

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
                router.navigate('/account');
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
            router.navigate('/admin/products/manage');
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

    getUsers = async() => {
        try {
            const users = await agent.Account.GetUsersAsync()
            runInAction( () => {
                this.users = users.slice()
            })
            console.log("Tutaj", users);
        }
        catch(error) {
            console.log(error)
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

}