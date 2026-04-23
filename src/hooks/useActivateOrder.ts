import { APIError } from "@/models";
import { activateOrderService } from "@/services/activateOrder";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

export const useActivateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => activateOrderService({ id }),
    onSuccess: () => {
      toast.success("تم استرجاع الطلب بنجاح");
      queryClient.invalidateQueries(["orders"]);
    },
    onError: (error: AxiosError<APIError>) => {
      toast.error(error.response?.data.message || "حدث خطأ ما");
    },
  });
};
