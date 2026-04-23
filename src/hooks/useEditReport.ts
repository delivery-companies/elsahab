import type { APIError } from "@/models";
import { type ChangeReportStatusPayload, editReportService } from "@/services/editReportService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";

export const useEditReport = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ status, id, repositoryID }: { id: number } & ChangeReportStatusPayload) =>
            editReportService(id, { status, repositoryID }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["reports"]
            });
        },
        onError: (error: AxiosError<APIError>) => {
            toast.error(error.response?.data.message || "حدث خطأ ما");
        }
    });
};
