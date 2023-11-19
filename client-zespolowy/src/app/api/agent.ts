import axios, { AxiosError, AxiosResponse } from "axios";
import { ChangePasswordFormValues, User, UserFormValues } from "../models/common/User";
import { Category } from "../models/onlineshop/Category";
import { Product } from "../models/onlineshop/Product";
import { CategoryStatus } from "../models/enums/CategoryStatus";
import { ProductStatus } from "../models/enums/ProductStatus";
import { Discount } from "../models/onlineshop/Discount";
import { Question } from "../models/onlineshop/Question";
import { Address } from "../models/onlineshop/Address";
import { Order } from "../models/onlineshop/Order";
import { OrderItem, OrderItemNewQuantity } from "../models/onlineshop/OrderItem";
import { OrderStatus } from "../models/enums/OrderStatus";
import { ShippingMethod } from "../models/onlineshop/ShippingMethod";
import { PaymentMethod } from "../models/onlineshop/PaymentMethod";
import { store } from "../stores/store";
import { router } from "../router/Routes";
import { toast } from "react-toastify";

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    })
}

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

axios.interceptors.response.use(async response => {
    if (import.meta.env.DEV) await sleep(500);
    return response;
}, (error: AxiosError) => {
    const {data, status, config} = error.response as AxiosResponse;
    switch (status) {
        case 400:
            if (config.method === 'get' && Object.hasOwnProperty.bind(data.errors)('id')) {
                router.navigate('not-found');
            }

            if (data.errors) {
                const modalStateErrors = [];
                for (const key in data.errors) {
                    if (data.errors[key]) {
                        modalStateErrors.push(data.errors[key])
                    }
                }
                throw modalStateErrors.flat();
            } else {
                toast.error(data);
            }
            break;
        case 401:
            toast.error('unauthorised')
            break;
        case 403:
            toast.error('forbidden')
            break;
        case 404:
            router.navigate('not-found');
            break;
        case 500:
            store.commonStore.setServerError(data);
            router.navigate('server-error');
            break;
    }
    return Promise.reject(error);
})

const responseBody = <T> (response: AxiosResponse<T>) => response.data;

axios.interceptors.request.use(config => {
    const token = store.commonStore.token;
    if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
    return config;
})

const requests = {
    get: <T> (url: string) => axios.get<T>(url).then(responseBody),
    post: <T> (url: string, body: object) => axios.post<T>(url, body).then(responseBody),
    put: <T> (url: string, body: object) => axios.put<T>(url, body).then(responseBody),
    patch: <T> (url: string, body: object) => axios.patch<T>(url, body).then(responseBody),
    del: <T> (url: string) => axios.delete<T>(url).then(responseBody),
}

const Account = {
    current: () => requests.get<User>('/account'),
    loginCustomer: (user: UserFormValues) => requests.post<User>('/account/login-customer', user),
    loginAdmin: (user: UserFormValues) => requests.post<User>('/account/login-admin', user),
    register: (user: UserFormValues) => requests.post<User>('/account/register', user),
    changePassword: (values: ChangePasswordFormValues) => requests.post<void>('/account/changepassword/', values),

    //reszta endpointów
    delete: (userId: number) => requests.del(`/accounts/${userId}`),
    updateAddress: (userId: number, address: Address) => requests.patch(`/accounts/${userId}/address`, address),
    addFavouriteProduct: (userId: number, productId: number) => requests.post(`/accounts/${userId}/favourites/${productId}`, {}),
    removeFavouriteProduct: (userId: number, productId: number) => requests.del(`/accounts/${userId}/favourites/${productId}`),
    resetPasswordRequest: (userId: number) => requests.post(`/accounts/${userId}/reset-password`, {}),
    getUserDiscount: (userId: number) => requests.get(`/accounts/${userId}/discount`),
    //setUserDiscount: (userId: number, discountValue: number) => requests.put(`/accounts/${userId}/discount`, discountValue), do naprawy (trzeba discountValue zamienić na obiekt tu i na backendzie)
}

const Categories = {
    create: (category: Category) => requests.post<number>(`/categories`, category),
    update: (categoryId:number, category: Category) => requests.put<void>(`/categories/${categoryId}`, category),
    changeStatus: (categoryId: number, newStatus: CategoryStatus) => requests.patch<void>(`categories/${categoryId}/${newStatus}`, {}),
}

//typy złożone się jeszcze zmienią
const Products = {
    create: (product: Product) => requests.post<number>("/products", product),
    update: (productId: number, product: Product) => requests.put<Product>(`/products/${productId}`, product),
    delete: (productId: number) => requests.del<void>(`/products/${productId}`),
    deletePermanently: (productId: number) => requests.del<void>(`/products/${productId}/permanently`),
    getDeleted: () => requests.get<Product[]>("/products/deleted"),
    changeStatus: (productId: number, newStatus: ProductStatus) => requests.patch<void>(`/products/${productId}/${newStatus}`, {}),
    getDetails: (productId: number) => requests.get<Product>(`/products/${productId}`),
    getTopPurchased: () => requests.get<Product[]>("/products/top-purchased"),
    getNewest: () => requests.get<Product[]>("/products/newest"),
    //getDiscounted: (dateRange: DateRange) => requests.get<Product[]>("/products/discounted?tutajparametryDataRange"), do poprawy
    updateImage: (productId: number, imageId: string) => requests.patch<void>(`/products/${productId}/image`, { imageId }),
    getPriceList: (categoryId: number) => axios.get(`products/price-list/${categoryId}`, { responseType: 'arraybuffer'}),
    addDiscount: (productId: number, discount: Discount) => requests.post<void>(`/products/${productId}/discount`, discount),
    askQuestion: (productId: number, question: Question) => requests.post<void>(`/products/${productId}/question`, question),
};

//typy złożone się jeszcze zmienią
const Orders = {
    create: (order: Order) => requests.post<number>("/orders", order),
    getDetails: (orderId: number) => requests.get<Order>(`/orders/${orderId}`),
    update: (orderId: number, order: Order) => requests.put<void>(`/orders/${orderId}`, order),
    addOrderItem: (orderId: number, item: OrderItem) => requests.post<void>(`/orders/${orderId}/items`, item),
    removeOrderItem: (orderId: number, productId: number) => requests.del<void>(`/orders/${orderId}/items/${productId}`),
    changeOrderItemQuantity: (orderId: number, item: OrderItemNewQuantity) => requests.patch<void>(`/orders/${orderId}/items`, item),
    changeOrderStatus: (orderId: number, status: OrderStatus) => requests.patch<void>(`/orders/${orderId}/${status}`, {}),
};

const ShippingMethods = {
    create: (method: ShippingMethod) => requests.post<number>("/shipping-methods", method),
    list: () => requests.get<ShippingMethod[]>("shipping-methods"),
    delete: (methodId: number) => requests.del<void>(`shipping-methods/${methodId}`),
}

const PaymentMethods = {
    create: (method: PaymentMethod) => requests.post<number>("/payment-methods", method),
    list: () => requests.get<PaymentMethod[]>("payment-methods"),
    delete: (methodId: number) => requests.del<void>(`payment-methods/${methodId}`),
}

const agent = {
    Account,
    Categories,
    Products,
    Orders,
    ShippingMethods,
    PaymentMethods
}

export default agent;