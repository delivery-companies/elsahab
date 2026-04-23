import { api } from "@/api";
import { getBannersEndpoint } from "@/api/apisUrl";
import type { Filters } from "./getEmployeesService";

export interface Banner {
    id: number;
    title: string;
    content: string;
    image: string;
    url: string;
    createdAt: string;
    company: {
        id: number;
        name: string;
    };
}

export interface GetBannersResponse {
    status: string;
    page: number;
    pagesCount: number;
    data: Banner[];
}

export const getBannersService = async ({ page = 1, size = 10 }: Filters = { page: 1, size: 10 }) => {
    const response = await api.get<GetBannersResponse>(getBannersEndpoint, {
        params: {
            page,
            size
        }
    });
    return response.data;
};
