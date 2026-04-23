import { api } from "@/api";
import { getAutomaticUpdatesEndpoint } from "@/api/apisUrl";
import type { governorateArabicNames } from "@/lib/governorateArabicNames ";
import type { orderStatusArabicNames } from "@/lib/orderStatusArabicNames";
import type { Filters } from "./getEmployeesService";

export type ReturnCondition = "WITH_AGENT" | "IN_REPOSITORY";

export const returnConditionArabicNames = {
  WITH_AGENT: "مع المندوب",
  IN_REPOSITORY: "في المخزن",
};

export interface AutomaticUpdate {
  id: number;
  createdAt: string;
  updatedAt: string;
  company: {
    id: number;
    name: string;
  };
  orderStatus: keyof typeof orderStatusArabicNames;
  governorate: keyof typeof governorateArabicNames;
  branch: {
    id: number;
    name: string;
  };
  newOrderStatus: keyof typeof governorateArabicNames;
  returnCondition: ReturnCondition;
  checkAfter: number;
  updateAt: string;
  enabled: boolean;
  notes?: string;
}

export interface GetAutomaticUpdateResponse {
  status: string;
  page: number;
  pagesCount: number;
  data: AutomaticUpdate[];
}

export const getAutomaticUpdatesService = async (
  { page = 1, size = 10, minified = false, branchId }: Filters = {
    page: 1,
    size: 10,
  }
) => {
  const response = await api.get<GetAutomaticUpdateResponse>(
    getAutomaticUpdatesEndpoint,
    {
      params: {
        page,
        size,
        minified: minified || undefined,
        branch_id: branchId || undefined,
      },
    }
  );
  return response.data;
};
