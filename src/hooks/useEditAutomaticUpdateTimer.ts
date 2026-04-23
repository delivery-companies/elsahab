import type { APIError } from "@/models";
import {
    type EditAutomaticUpdateDatePayload,
    editAutomaticUpdateService
} from "@/services/editAutomaticUpdate";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";

export const useEditAutomaticUpdateTimer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            id,
            data
        }: {
            id: number;
            data: EditAutomaticUpdateDatePayload;
        }) => editAutomaticUpdateService(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["automaticUpdates"]
            });
            toast.success("تم تعديل الموعد بنجاح");
        },
        onError: (error: AxiosError<APIError>) => {
            toast.error(error.response?.data.message || "حدث خطأ ما");
        }
    });
};
