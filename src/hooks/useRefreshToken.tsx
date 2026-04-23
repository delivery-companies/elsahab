import { refreshTokenService } from "@/services/refreshToken";
import { useQuery } from "@tanstack/react-query";

export const useRefreshToken = () => {
  const refreshToken = localStorage.getItem("refreshToken");
  return useQuery({
    queryKey: ["refreshToken"],
    queryFn: () => refreshTokenService(refreshToken),
    enabled: !!refreshToken,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
    retry: false,
  });
};
