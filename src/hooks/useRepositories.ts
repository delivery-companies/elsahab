import type { Filters } from "@/services/getEmployeesService";
import { getRepositoriesService } from "@/services/getRepositoriesService";
import { useQuery } from "@tanstack/react-query";

export const useRepositories = (
  {
    page = 1,
    size = 10,
    minified,
    type,
    branchId,
    forBranch,
    getChildBranchs,
  }: Filters = {
    page: 1,
    size: 10,
  },
) => {
  return useQuery({
    queryKey: [
      "repositories",
      { page, size, minified, type, branchId, forBranch, getChildBranchs },
    ],
    queryFn: () =>
      getRepositoriesService({
        page,
        size,
        minified,
        type,
        branchId,
        getChildBranchs,
        forBranch,
      }),
  });
};
