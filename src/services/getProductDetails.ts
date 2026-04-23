import { api } from "@/api";
import { getProductDetailsEndpoint } from "@/api/apisUrl";

export interface ProductDetails {
    id: number;
    title: string;
    price: number;
    image: string;
    stock: number;
    category: {
        title: string;
    };
    productColors: {
        quantity: number;
        color: {
            title: string;
            id: number;
        };
    }[];
    productSizes: {
        quantity: number;
        size: {
            title: string;
            id: number;
        };
    }[];
}

export interface GetProductsResponse {
    status: string;
    data: ProductDetails;
}

export const getProductDetailsService = async (id: number) => {
    const response = await api.get<GetProductsResponse>(getProductDetailsEndpoint + id);
    return response.data;
};
