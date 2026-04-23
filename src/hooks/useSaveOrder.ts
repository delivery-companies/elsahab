import type { APIError } from "@/models";
import { saveOrder } from "@/services/customerOutputs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";

export const useSaveOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data:{storeId:number,orderId:string,companyId:number,type:string,repository:number}) => {
            return saveOrder(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["customerOutputs"]
            });
            toast.success("تم اضافة الطلب");
        },
        onError: (error: AxiosError<APIError>) => {
            toast.error(error.response?.data.message || "حدث خطأ ما");
        }
    });
};
