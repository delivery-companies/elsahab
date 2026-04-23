import { api } from "@/api";
import { deleteEmployeeEndpoint } from "@/api/apisUrl";

export const reactivateEmployeeService = async ({ id }: { id: number }) => {
    const response = await api.patch(`${deleteEmployeeEndpoint + id}/reactivate`);
    return response.data;
};
