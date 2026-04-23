import type { APIError } from "@/models";
import { createClientsService, generateApiKey } from "@/services/createClients";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => {
      return createClientsService(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["clients"],
      });
      toast.success("تم اضافة العميل بنجاح");
    },
    onError: (error: AxiosError<APIError>) => {
      toast.error(error.response?.data.message || "حدث خطأ ما");
    },
  });
};

export const useGenerateApi = (onSuccessKey: (key: string) => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => generateApiKey(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success("تم توليد API Key بنجاح");

      // ⬇️ نبعته للـ state
      onSuccessKey(res.apiKey);
    },
    onError: (error: AxiosError<APIError>) => {
      toast.error(error.response?.data.message || "حدث خطأ ما");
    },
  });
};
