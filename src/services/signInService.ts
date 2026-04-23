import { api } from "@/api";
import { signInUrl } from "@/api/apisUrl";
import type { LoginMetadata } from "@/lib/getLoginMetadata";

export interface SignInRequest {
    username: string;
    password: string;
    loginMetadata?: LoginMetadata;
}

export interface SignInResponse {
    status: string;
    token: string;
    refreshToken: string;
}

export const signInService = async (data: SignInRequest) => {
    const response = await api.post<SignInResponse>(signInUrl, data);
    return response.data;
};
