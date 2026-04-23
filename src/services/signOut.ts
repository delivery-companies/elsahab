import { api } from "@/api";
import { signOutEndpoint } from "@/api/apisUrl";

export const signOutService = async () => {
    const token = localStorage.getItem("token");
    const response = await api.post(signOutEndpoint, undefined, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};
