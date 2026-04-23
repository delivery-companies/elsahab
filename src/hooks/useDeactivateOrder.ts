import type { APIError } from "@/models";
import { deactivateOrderService } from "@/services/deactivateOrder";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";

export const useDeactivateOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deactivateOrderService({ id }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["orders"]
            });
        },
        onError: (error: AxiosError<APIError>) => {
            toast.error(error.response?.data.message || "حدث خطأ ما");
        }
    });
};
