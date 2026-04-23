import { getAutomaticUpdatesService } from "@/services/getAutomaticUpdates";
import type { Filters } from "@/services/getEmployeesService";
import { useQuery } from "@tanstack/react-query";

export const useAutomaticUpdates = (
  { page = 1, size = 10, minified, branchId }: Filters = { page: 1, size: 10 },
  enabled = true
) => {
  return useQuery({
    queryKey: ["automaticUpdates", { page, size, minified, branchId }],
    queryFn: () =>
      getAutomaticUpdatesService({ page, size, minified, branchId }),
    enabled,
  });
};
