import {
  getOrderDetailsService,
  getOrderDetailsServiceById,
} from "@/services/getOrderDetails";
import { useQuery } from "@tanstack/react-query";

export const useOrderDetails = (id: string) => {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: () => getOrderDetailsService(id),
    enabled: !!id,
  });
};

export const useOrderDetailsById = (id: string) => {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: () => getOrderDetailsServiceById(id),
    enabled: !!id,
  });
};
