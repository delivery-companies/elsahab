import type { clientTypeArabicNames } from "@/lib/clientTypeArabicNames";
import type { rolesArabicNames } from "@/lib/rolesArabicNames";
import { queryClient, router } from "@/main";
import type { SignInResponse } from "@/services/signInService";
import JWTDecode from "jwt-decode";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type JWTRole =
  | keyof typeof rolesArabicNames
  | keyof typeof clientTypeArabicNames;

interface IAuthStore extends SignInResponse {
  setAuth: (data: SignInResponse) => void;
  logout: () => void;
  id: string;
  name: string;
  username: string;
  role: JWTRole | null;
  companyName: string;
  companyID: string;
  mainRepository: boolean;
  branchId: string;
  repositoryId: string;
  type: string;
  orderStatus: string[] | null;
  permissions: string[] | null;
}

interface TokenPayload {
  id: string;
  name: string;
  username: string;
  role: JWTRole | null;
  exp: number;
  iat: number;
  companyName: string | null;
  companyID: string | null;
  permissions: string[] | null;
  orderStatus: string[] | null;
  mainRepository: boolean;
  branchId: string;
  repositoryId: string;
  type: string;
}

export const authStore = create<IAuthStore>()(
  persist(
    (set) => ({
      status: "",
      token: "",
      companyName: "",
      refreshToken: "",
      companyID: "",
      id: "",
      name: "",
      role: null,
      username: "",
      mainRepository: false,
      branchId: "",
      repositoryId: "",
      type: "",
      orderStatus: null,
      permissions: null,
      setAuth: (data: SignInResponse) => {
        const decodedToken = JWTDecode<TokenPayload>(data.token);
        set({
          status: "success",
          companyName: decodedToken.companyName || "",
          token: data.token,
          id: decodedToken.id,
          name: decodedToken.name,
          refreshToken: data.refreshToken,
          username: decodedToken.username,
          role: decodedToken.role,
          companyID: decodedToken.companyID || "",
          mainRepository: decodedToken.mainRepository,
          branchId: decodedToken.branchId,
          repositoryId: decodedToken.repositoryId,
          type: decodedToken.type,
          orderStatus: decodedToken.orderStatus,
          permissions: decodedToken.permissions,
        });
        localStorage.setItem("token", data.token);
        localStorage.setItem("refreshToken", data.refreshToken);
      },
      logout: () => {
        set({
          status: "",
          token: "",
          companyName: "",
          refreshToken: "",
          id: "",
          name: "",
          username: "",
          role: null,
          companyID: "",
          branchId: "",
          repositoryId: "",
          type: "",
        });
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        queryClient.clear();
        router.navigate("/");
      },
    }),
    {
      name: "auth-storage",
    }
  )
);

export const useAuth = () => authStore((state) => state);
