import {
    type CreateOrdersDocumentationReportPDFPayload,
    createOrdersDocumentationService
} from "@/services/createOrdersDocumentation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateReportsDocumentation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateOrdersDocumentationReportPDFPayload) =>
            createOrdersDocumentationService(data),
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
