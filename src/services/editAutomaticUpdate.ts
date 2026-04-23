import { api } from "@/api";
import { editAutomaticUpdateEndpoint } from "@/api/apisUrl";
import type { governorateArabicNames } from "@/lib/governorateArabicNames ";
import type { orderReturnConditionArabicNames } from "@/lib/orderReturnConditionArabicNames";
import type { orderStatusArabicNames } from "@/lib/orderStatusArabicNames";

export interface EditAutomaticUpdateDatePayload {
  orderStatus?: keyof typeof orderStatusArabicNames;
  newOrderStatus?: keyof typeof orderStatusArabicNames;
  governorate?: keyof typeof governorateArabicNames;
  returnCondition?: keyof typeof orderReturnConditionArabicNames;
  checkAfter?: number;
  branchID?: number;
  enabled?: boolean;
  updateAt?: number;
  notes?: string;
}

export const editAutomaticUpdateService = async (
  id: number,
  payload: EditAutomaticUpdateDatePayload
) => {
  const { data } = await api.patch(editAutomaticUpdateEndpoint + id, payload);
  return data;
};
