import { makeAutoObservable, runInAction } from "mobx";
import { ChangePasswordFormValues, User, UserFormValues } from "../models/common/User";
import agent from "../api/agent";
import { store } from "./store";

export default class UserStore {
    user: User | null = null;

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
            //router.navigate('/....');
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
            });
            //router.navigate('/....');
        } catch (error) {
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
            });
            //router.navigate('/....');
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    logout = () => {
        store.commonStore.setToken(null);
        
        this.user = null;
        //router.navigate('/....');
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
            runInAction(() => this.user = user);
        } catch (error) {
            console.log(error);
        }
    }
}