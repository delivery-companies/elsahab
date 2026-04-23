import { api } from "@/api";
import { deleteEmployeeEndpoint } from "@/api/apisUrl";

export const deleteEmployeeService = async ({ id }: { id: number }) => {
    const response = await api.delete(deleteEmployeeEndpoint + id);
    return response.data;
};
