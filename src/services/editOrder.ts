import { api } from "@/api";
import { editOrderEndpoint } from "@/api/apisUrl";
import type { orderSecondaryStatusArabicNames } from "@/lib/orderSecondaryStatusArabicNames";
import type { orderStatusArabicNames } from "@/lib/orderStatusArabicNames";
import { Order } from "./getOrders";

export interface EditOrderPayload {
  paidAmount?: number;
  totalCost?: number;
  discount?: number;
  status?: keyof typeof orderStatusArabicNames;
  deliveryAgentID?: number;
  deliveryDate?: string;
  recipientName?: string;
  recipientPhones?: string[];
  recipientAddress?: string;
  notes?: string;
  details?: string;
  repositoryID?: number;
  branchID?: number;
  clientID?: number;
  confirmed?: boolean;
  secondaryStatus?: keyof typeof orderSecondaryStatusArabicNames;
  inquiryEmployeesIDs?: number[];
  forwarded?: boolean;
  forwardedCompanyID?: number;
  processed?: boolean;
  weight?: number;
  quantity?: number;
  forwardedToMainRepo?: boolean;
  forwardedToGov?: boolean;
  forwardedRepo?: number;
  storeID?: number;
  governorate?: string;
  locationID?: number;
}

export const editOrderService = async ({
  data,
  id,
}: {
  data: EditOrderPayload;
  id: string;
}) => {
  const response = await api.patch<EditOrderPayload>(
    editOrderEndpoint + id,
    data,
  );
  return response.data;
};

export const saveOrderInRepositoryService = async ({
  data,
  id,
}: {
  data: EditOrderPayload;
  id: string;
}) => {
  const response = await api.patch<{
    multi?: boolean;
    status?: string;
    data?: Order[];
  }>(editOrderEndpoint + "addOrderToRepository/" + id, data);
  return response.data;
};
