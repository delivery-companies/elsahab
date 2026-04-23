import type { APIError } from "@/models";
import { saveAndCreateReport } from "@/services/customerOutputs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";

export const useGetCustomerOutputs = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      companyId: number;
      type: string;
      storeId: number;
      repositoryId: number;
      repositoryName: string;
      receivingAgentId?: number;
      orderIds?: string[];
    }) => {
      return saveAndCreateReport(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reports"],
      });
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
      toast.success("تم انشاء الكشف بنجاح");
    },
    onError: (error: AxiosError<APIError>) => {
      toast.error(error.response?.data.message || "حدث خطأ ما");
    },
  });
};
