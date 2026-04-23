import { api } from "@/api";
import type { Filters } from "./getEmployeesService";

type employee ={
    user:{
        id: number,
        name: string,
    }
}
export interface Department {
    id: number;
    name: string;
    createdBy: string;
    employees:employee[]
}

export interface GetDepartmentResponse {
    status: string;
    page: number;
    pagesCount: number;
    data: Department[];
}

export const getDepartmentService = async (
    { page = 1, size = 10 }: Filters = { page: 1, size: 10 }
) => {
    const response = await api.get<GetDepartmentResponse>("/department", {
        params: {
            page,
            size,
        }
    });
    return response.data;
};


export const createDepartmentService = async (data: FormData) => {
    const response = await api.post<FormData>("/department", data);
    return response.data;
};

export interface editDepartmentPayload {
    id:number;
    name: string;
}
export const editDepartmentService = async (data: editDepartmentPayload) => {
    const response = await api.patch<editDepartmentPayload>("/department/"+data.id, data);
    return response.data;
};

export const assignEmployeesToDepartment = async (data: FormData) => {
    const response = await api.post<FormData>("/assignEmployees", data);
    return response.data;
};
export const deleteDepartmentService = async ({ id }: { id: number }) => {
    const response = await api.delete("/department/"+id);
    return response.data;
};