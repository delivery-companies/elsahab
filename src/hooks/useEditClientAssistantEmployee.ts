import type { APIError } from "@/models";
import {
    type EditClientAssistantStoresPayload,
    editClientAssistantStoresService
} from "@/services/editEmployee";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";

export const useEditClientAssistantEmployee = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: EditClientAssistantStoresPayload) => {
            return editClientAssistantStoresService(data);
        },
        onSuccess: () => {
            toast.success("تم تعديل الموظف بنجاح");
            queryClient.invalidateQueries({
                queryKey: ["employees"]
            });
        },
        onError: (error: AxiosError<APIError>) => {
            toast.error(error.response?.data.message || "حدث خطأ ما");
        }
    });
};
