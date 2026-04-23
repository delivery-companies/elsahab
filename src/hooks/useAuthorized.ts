import { type JWTRole, authStore, useAuth } from "@/store/authStore";

export const useAuthorization = (allowedRoles: JWTRole[]) => {
    const { role } = useAuth();

    if (role && allowedRoles.includes(role)) {
        return true;
    }
    return false;
};

export const isAuthorized = (allowedRoles: JWTRole[]) => {
    const { role } = authStore.getState();

    if (role && !allowedRoles.includes(role)) {
        return false;
    }

    return true;
};

export const renderChildrenBasedOnRole = (allowedRoles: JWTRole[], children: React.ReactNode) => {
    if (isAuthorized(allowedRoles)) {
        return children;
    }

    return null;
};

export const hideChildrenBasedOnRole = (allowedRoles: JWTRole[], children: React.ReactNode) => {
    if (isAuthorized(allowedRoles)) {
        return null;
    }

    return children;
};
