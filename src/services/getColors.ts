import { api } from "@/api";
import { getColorsEndpoint } from "@/api/apisUrl";
import type { Filters } from "./getEmployeesService";

export interface Color {
    id: number;
    title: string;
    code: string;
    createdAt: string;
    updatedAt: string;
}

export interface GetColorsResponse {
    status: string;
    page: number;
    pagesCount: number;
    data: Color[];
}

export const getColorsService = async (
    { page = 1, size = 10, minified }: Filters = { page: 1, size: 10 }
) => {
    const response = await api.get<GetColorsResponse>(getColorsEndpoint, {
        params: {
            page,
            size,
            minified
        }
    });
    return response.data;
};
