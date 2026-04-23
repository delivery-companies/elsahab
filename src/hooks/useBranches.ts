import {
  type BranchFilters,
  getBranchesService,
} from "@/services/getBranchesService";
import { useQuery } from "@tanstack/react-query";

export function useBranches(
  {
    page = 1,
    size = 10,
    governorate,
    location_id,
    minified,
    getAll,
    myBranchs,
  }: BranchFilters = {
    page: 1,
    size: 10,
  },
) {
  return useQuery({
    queryKey: [
      "branches",
      { page, size, governorate, location_id, minified, getAll, myBranchs },
    ],
    queryFn: () =>
      getBranchesService({
        page,
        size,
        governorate,
        location_id,
        minified,
        getAll,
        myBranchs,
      }),
  });
}
