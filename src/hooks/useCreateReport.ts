import { type CreateReportPayload, createReportService } from "@/services/createReport";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateReport = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateReportPayload) => createReportService(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["reports"]
            });
            queryClient.invalidateQueries({
                queryKey: ["orders"]
            });
            queryClient.invalidateQueries({
                queryKey: ["timeline"]
            });
        }
    });
};
