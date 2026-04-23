import { useValidateToken } from "@/hooks/useValidateToken";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoutes = () => {
    const { isSuccess } = useValidateToken();
    return isSuccess ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoutes;
