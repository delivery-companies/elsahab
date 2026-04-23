import { APIError } from "@/models";
import { assignEmployeesToDepartment, createDepartmentService, editDepartmentService, getDepartmentService } from "@/services/departments";
import { type BranchFilters } from "@/services/getBranchesService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

export function useDepartments(
    { page = 1, size = 10 }: BranchFilters = {
        page: 1,
        size: 10
    },
    enabled = true
) {
    return useQuery({
        queryKey: ["departments", { page, size }],
        queryFn: () =>
            getDepartmentService({
                page,
                size,
            }),
        enabled
    });
}

export const useEditDepartment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ( data : { id: number; name:string }) => {
            return editDepartmentService(
                data
            );
        },
        onSuccess: () => {
            toast.success("تم تعديل الأسم بنجاح");
            queryClient.invalidateQueries({
                queryKey: ["departments"]
            });
        },
        onError: (error: AxiosError<APIError>) => {
            toast.error(error.response?.data.message || "حدث خطأ ما");
        }
    });
};

export const useCreateDepartment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: FormData) => {
            return createDepartmentService(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["departments"]
            });
            toast.success("تم اضافة القسم بنجاح");
        },
        onError: (error: AxiosError<APIError>) => {
            toast.error(error.response?.data.message || "حدث خطأ ما");
        }
    });
};

export const useAssignEmployeesToDepartment= () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: FormData) => {
            return assignEmployeesToDepartment(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["departments"]
            });
            toast.success("تم اضافة الموظفين بنجاح");
        },
        onError: (error: AxiosError<APIError>) => {
            toast.error(error.response?.data.message || "حدث خطأ ما");
        }
    });
};