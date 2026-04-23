import { api } from "@/api";
import { createProductEndpoint } from "@/api/apisUrl";

export interface CreateProductPayload {
    title: string;
    price: number;
    image: File;
    stock: number;
    category: string;
    colors: {
        title: string;
        quantity: number;
    }[];
    sizes: {
        title: string;
        quantity: number;
    }[];
}

export const createProductService = async (data: FormData) => {
    const response = await api.post<FormData>(createProductEndpoint, data, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
};
