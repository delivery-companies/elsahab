import type { APIError } from "@/models";
import { deactivateReportService } from "@/services/deactivateReport";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";

export const useDeactivateReport = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deactivateReportService({ id }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["reports"]
            });
            queryClient.invalidateQueries({
                queryKey: ["orders"]
            });
        },
        onError: (error: AxiosError<APIError>) => {
            toast.error(error.response?.data.message || "حدث خطأ ما");
        }
    });
};
