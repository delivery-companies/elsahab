import type { APIError } from "@/models";
import { type EditStoreClientAssistantPayload, editStoreClientAssistantService } from "@/services/editStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";

export const useEditStore = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: EditStoreClientAssistantPayload) => {
            return editStoreClientAssistantService(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["stores"]
            });
            toast.success("تم تعديل المتجر بنجاح");
        },
        onError: (error: AxiosError<APIError>) => {
            toast.error(error.response?.data.message || "حدث خطأ أثناء تعديل المتجر");
        }
    });
};
