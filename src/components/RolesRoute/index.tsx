import { useAuthorization } from "@/hooks/useAuthorized";
import type { JWTRole } from "@/store/authStore";
import { Navigate, Outlet } from "react-router-dom";

export const RolesRoute = ({ roles }: { roles: JWTRole[] }) => {
    const isAuthorized = useAuthorization(roles);

    return isAuthorized ? <Outlet /> : <Navigate replace to="/orders" />;
};
