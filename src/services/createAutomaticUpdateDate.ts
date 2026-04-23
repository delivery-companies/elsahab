import { api } from "@/api";
import { createAutomaticUpdateEndpoint } from "@/api/apisUrl";
import type { orderReturnConditionArabicNames } from "@/lib/orderReturnConditionArabicNames";
import type { orderStatusArabicNames } from "@/lib/orderStatusArabicNames";

export interface CreateAutomaticUpdateDatePayload {
  orderStatus: keyof typeof orderStatusArabicNames;
  newOrderStatus: keyof typeof orderStatusArabicNames;
  returnCondition?: keyof typeof orderReturnConditionArabicNames;
  checkAfter?: number;
  branchID: number;
  updateAt?: number;
  notes?: string;
}

export const createAutomaticUpdateDateService = async (
  payload: CreateAutomaticUpdateDatePayload
) => {
  const { data } = await api.post(createAutomaticUpdateEndpoint, payload);
  return data;
};
