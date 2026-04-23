import { api } from "@/api";

export type PublicLocationResponse = Array<{
    id: number;
    name: string;
}>;

export const getPublicLocationsService = async () => {
    const response = await api.get<PublicLocationResponse>("public/locations");

    return response.data;
};
