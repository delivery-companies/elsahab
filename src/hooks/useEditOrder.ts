import type { APIError } from "@/models";
import { type EditOrderPayload, editOrderService } from "@/services/editOrder";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";

export const useEditOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: EditOrderPayload }) => {
            return editOrderService({
                id,
                data
            });
        },
        onSuccess: () => {
            toast.success("تم تعديل الطلب بنجاح");
            queryClient.invalidateQueries({
                queryKey: ["orders"]
            });
            queryClient.invalidateQueries({
                queryKey: ["timeline"]
            });
        },
        onError: (error: AxiosError<APIError>) => {
            toast.error(error.response?.data.message || "حدث خطأ ما");
        }
    });
};
