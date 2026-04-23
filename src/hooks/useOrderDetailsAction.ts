import { getOrderDetailsService } from "@/services/getOrderDetails";
import { getOrdersService } from "@/services/getOrders";
import { useMutation } from "@tanstack/react-query";

export const useOrderDetailsAction = () => {
    return useMutation({
        mutationFn: (id: string) => getOrderDetailsService(id)
    });
};

export const useOrderDetailsByReceiptNumberAction = () => {
    return useMutation({
        mutationFn: (receiptNumber: string) => getOrdersService({ receipt_number: receiptNumber })
    });
};
