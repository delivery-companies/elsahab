import { api } from "@/api";
import { deleteEmployeeEndpoint } from "@/api/apisUrl";

export const deactivateEmployeeService = async ({ id }: { id: number }) => {
    const response = await api.patch(`${deleteEmployeeEndpoint + id}/deactivate`);
    return response.data;
};
