import { api } from "@/api";
import { editColorEndpoint } from "@/api/apisUrl";

export const editColorService = async ({
    title,
    id,
    code
}: {
    title: string;
    id: number;
    code: string;
}) => {
    const response = await api.patch<{
        title: string;
        id: number;
        code: string;
    }>(editColorEndpoint + id, { title, code });
    return response.data;
};
