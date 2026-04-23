import { APIError } from "@/models";
import { reactivateClientService } from "@/services/reactivateClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

export const useActivateClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => reactivateClientService({ id }),
    onSuccess: () => {
      toast.success("تم تفعيل العميل بنجاح");
      queryClient.invalidateQueries(["clients"]);
    },
    onError: (error: AxiosError<APIError>) => {
      toast.error(error.response?.data.message || "حدث خطأ ما");
    },
  });
};
