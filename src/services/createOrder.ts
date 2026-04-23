import { api } from "@/api";
import { createOrderEndpoint } from "@/api/apisUrl";

export interface CreateOrderItem {
    withProducts: boolean;
    totalCost?: number;
    quantity?: number;
    weight?: number;
    recipientName?: string;
    recipientPhones: string[];
    recipientAddress: string;
    notes?: string;
    details?: string;
    deliveryType?: string;
    governorate: string;
    locationID?: number;
    storeID: number;
    products?: {
        productID: number;
        quantity: number;
        colorID: number;
        sizeID: number;
    }[];
    receiptNumber?: number | string;
    branchID?: number;
    forwardedCompanyID?: number;
}

export type CreateOrderPayload = CreateOrderItem | CreateOrderItem[];

export const createOrderService = async (data: CreateOrderPayload) => {
    const response = await api.post<CreateOrderPayload>(createOrderEndpoint, data);
    return response.data;
};
