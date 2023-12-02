import axios, { AxiosError, AxiosResponse } from "axios";
import { ChangePasswordFormValues, User, UserFormValues } from "../models/common/User";
import { Category, CategoryTree } from "../models/onlineshop/Category";
import { Product, ProductFormValues } from "../models/onlineshop/Product";
import { CategoryStatus } from "../models/enums/CategoryStatus";
import { ProductStatus } from "../models/enums/ProductStatus";
import { UserDiscount } from "../models/onlineshop/UserDiscount";
import { Address } from "../models/onlineshop/Address";
import { Order } from "../models/onlineshop/Order";
import { OrderItem, OrderItemNewQuantity } from "../models/onlineshop/OrderItem";
import { OrderStatus } from "../models/enums/OrderStatus";
import { ShippingMethod } from "../models/onlineshop/ShippingMethod";
import { PaymentMethod } from "../models/onlineshop/PaymentMethod";
import { store } from "../stores/store";
import { router } from "../router/Routes";
import { toast } from "react-toastify";
import { ProductDiscount } from "../models/onlineshop/ProductDiscount";
import { Photo } from "../models/onlineshop/Photo";
import { PaginatedResult } from "../models/common/Pagination";
import { ProductExpert } from "../models/onlineshop/ProductExpert";
import { AccountDetails } from "../models/onlineshop/AccountDetails";

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    })
}

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

axios.interceptors.response.use(async response => {
    if (import.meta.env.DEV) await sleep(100);

    const pagination = response.headers['pagination'];
    if (pagination) {
        response.data = new PaginatedResult(response.data, JSON.parse(pagination));
        return response as AxiosResponse<PaginatedResult<unknown>>;
    }
    
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
            toast.error('Unauthorised')
            break;
        case 403:
            toast.error('Forbidden')
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

    details: (userId: string) => requests.get<AccountDetails>(`/account/${userId}/details`),
    delete: (userId: string) => requests.del<void>(`/accounts/${userId}`),
    updateAddress: (userId: string, address: Address) => requests.patch<void>(`/accounts/${userId}/address`, address),
    getFavouriteProducts: () => requests.get<Product[]>(`/account/favourites`),
    addFavouriteProduct: (userId: string, productId: number) => requests.post<void>(`/accounts/${userId}/favourites/${productId}`, {}),
    removeFavouriteProduct: (userId: string, productId: number) => requests.del<void>(`/accounts/${userId}/favourites/${productId}`),
    //resetPasswordRequest: (userId: string) => requests.post(`/accounts/${userId}/reset-password`, {}),
    getUserDiscount: (userId: string) => requests.get<number>(`/accounts/${userId}/discount`),
    setUserDiscount: (userId: string, userDiscount: UserDiscount) => requests.put(`/accounts/${userId}/discount`, userDiscount), 
}

const Categories = {
    create: (category: Category) => requests.post<number>(`/categories`, category),
    update: (categoryId:number, category: Category) => requests.put<void>(`/categories/${categoryId}`, category),
    changeStatus: (categoryId: number, newStatus: CategoryStatus) => requests.patch<void>(`categories/${categoryId}/${newStatus}`, {}),
    getCategoryTree: () => requests.get<CategoryTree>(`/categories`),
}

const Products = {
    list: (params: URLSearchParams) => axios.get<PaginatedResult<Product[]>>(`/products`, {params})
        .then(responseBody),
    create: (product: ProductFormValues) => requests.post<number>("/products", product),
    update: (productId: number, product: ProductFormValues) => requests.put<Product>(`/products/${productId}`, product),
    deletePermanently: (productId: number) => requests.del<void>(`/products/${productId}/permanently`),
    getDeleted: () => requests.get<Product[]>("/products/deleted"),
    changeStatus: (productId: number, newStatus: ProductStatus) => requests.patch<void>(`/products/${productId}/${newStatus}`, {}),
    getDetails: (productId: number) => requests.get<Product>(`/products/${productId}`),
    getTopPurchased: () => requests.get<Product[]>("/products/top-purchased"),
    getNewest: () => requests.get<Product[]>("/products/newest"),
    getDiscounted: () => requests.get<Product[]>("/products/discounted"),
    //getPriceList: (categoryId: number) => axios.get(`products/price-list/${categoryId}`, { responseType: 'arraybuffer'}),
    addDiscount: (productId: number, productDiscount: ProductDiscount) => requests.post<void>(`/products/${productId}/discount`, productDiscount),
    //askQuestion: (productId: number, question: Question) => requests.post<void>(`/products/${productId}/question`, question),
    getProductsExperts: () => requests.get<ProductExpert[]>("/products/experts"),
};

const Orders = {
    list: () => requests.get<Order[]>("getOrders"),
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

const Photos = {
    uploadPhoto: (productId: number, file: Blob) => {
        const formData = new FormData();
        formData.append('File', file);
        return axios.post<Photo>(`product/${productId}/photo`, formData, {
            headers: {'Content-Type': 'multipart/form-data'}
        })
    },
    deletePhoto: (photoId: string) => axios.delete(`/photos/${photoId}`)
}

const agent = {
    Account,
    Categories,
    Products,
    Orders,
    ShippingMethods,
    PaymentMethods,
    Photos
}

export default agent;