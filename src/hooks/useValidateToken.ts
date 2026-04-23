import { validateToken } from "@/services/validateToken";
import { useQuery } from "@tanstack/react-query";

export const useValidateToken = () => {
    const token = localStorage.getItem("token");
    return useQuery({
        queryKey: ["validateToken"],
        queryFn: () => validateToken(),
        enabled: !!token,
        refetchOnMount: false,
        refetchOnWindowFocus: true,
        retry: false
    });
};
