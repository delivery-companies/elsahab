import {
  type CreateOrdersDocumentationReportPDFPayload,
  createRepositoryOrdersDocumentationService,
} from "@/services/createOrdersDocumentation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateReportsDocumentation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateOrdersDocumentationReportPDFPayload) =>
      createRepositoryOrdersDocumentationService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reports"],
      });
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },
  });
};
