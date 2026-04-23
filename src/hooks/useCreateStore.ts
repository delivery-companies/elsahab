import type { APIError } from "@/models";
import { createStoreService } from "@/services/createStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";

export const useCreateStore = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: FormData) => {
            return createStoreService(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["stores"]
            });
            toast.success("تم اضافة المتجر بنجاح");
        },
        onError: (error: AxiosError<APIError>) => {
            toast.error(error.response?.data.message || "حدث خطأ ما");
        }
    });
};
