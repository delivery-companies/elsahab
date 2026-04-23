import { APIError } from "@/models";
import { activateStoreService } from "@/services/activateStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

export const useActivateStore = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => activateStoreService({ id }),
    onSuccess: () => {
      toast.success("تم تفعيل الموظف بنجاح");
      queryClient.invalidateQueries(["stores"]);
    },
    onError: (error: AxiosError<APIError>) => {
      toast.error(error.response?.data.message || "حدث خطأ ما");
    },
  });
};
