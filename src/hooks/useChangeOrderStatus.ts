import type { APIError } from "@/models";
import { type EditOrderPayload, editOrderService } from "@/services/editOrder";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";

export const useChangeOrderStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ data, id }: { data: EditOrderPayload; id: string }) => {
            return editOrderService({
                id,
                data
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["orders"]
            });
            queryClient.invalidateQueries({
                queryKey: ["orderTimeline"]
            });
        },
        onError: (error: AxiosError<APIError>) => {
            toast.error(error.response?.data.message || "حدث خطأ ما");
        }
    });
};
