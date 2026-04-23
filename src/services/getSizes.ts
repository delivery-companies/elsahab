import { api } from "@/api";
import { getSizesEndpoint } from "@/api/apisUrl";
import type { Filters } from "./getEmployeesService";

export interface Size {
    id: number;
    title: string;
    createdAt: string;
    updatedAt: string;
}

export interface GetSizesResponse {
    status: string;
    page: number;
    pagesCount: number;
    data: Size[];
}

export const getSizesService = async ({ page = 1, size = 10, minified }: Filters = { page: 1, size: 10 }) => {
    const response = await api.get<GetSizesResponse>(getSizesEndpoint, {
        params: {
            page,
            size,
            minified
        }
    });
    return response.data;
};
