import { type CreateClientReportPDFPayload, createClientPDFService } from "@/services/createClientPDF";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateClientReportPDF = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateClientReportPDFPayload) => createClientPDFService(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["reports"]
            });
            queryClient.invalidateQueries({
                queryKey: ["orders"]
            });
        }
    });
};
