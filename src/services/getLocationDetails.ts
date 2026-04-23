import { api } from "@/api";
import { getLocationDetailsEndpoint } from "@/api/apisUrl";
import type { Location } from "./getLocations";

export interface GetLocationDetailsResponse {
    status: string;
    data: Location;
}

export const getLocationDetailsService = async (id: number) => {
    const response = await api.get<GetLocationDetailsResponse>(getLocationDetailsEndpoint + id);
    return response.data;
};
