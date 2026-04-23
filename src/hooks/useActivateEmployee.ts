import { APIError } from "@/models";
import { reactivateEmployeeService } from "@/services/reactivateEmployee";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

export const useActivateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => reactivateEmployeeService({ id }),
    onSuccess: () => {
      toast.success("تم تفعيل الموظف بنجاح");
      queryClient.invalidateQueries(["employees"]);
    },
    onError: (error: AxiosError<APIError>) => {
      toast.error(error.response?.data.message || "حدث خطأ ما");
    },
  });
};
