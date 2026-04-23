import { api } from "@/api";
import { getClientsEndpoint } from "@/api/apisUrl";
import type { ClientsFilters } from "@/hooks/useClients";
import type { clientTypeArabicNames } from "@/lib/clientTypeArabicNames";
import type { governorateArabicNames } from "@/lib/governorateArabicNames ";
import type { Branch } from "./getBranchesService";

export interface Client {
  id: number;
  name: string;
  phone: string;
  username: string; // add username to the payload
  avatar: string | null;
  role: keyof typeof clientTypeArabicNames;
  showNumbers: boolean;
  showDeliveryNumber: boolean;
  isExternal: boolean;
  branch: Branch | null;
  createdBy: {
    id: number;
    name: string;
  };
  company: {
    id: number;
    name: string;
  };
  governoratesDeliveryCosts: {
    cost: number;
    governorate: keyof typeof governorateArabicNames;
  }[];
}

export interface GetClientsResponse {
  status: string;
  page: number;
  pagesCount: number;
  data: Client[];
}

export const getClientsService = async (
  {
    page = 1,
    size = 10,
    deleted = false,
    minified,
    store_id,
    name,
    branch_id,
    phone,
  }: ClientsFilters = {
    page: 1,
    size: 10,
  }
) => {
  const response = await api.get<GetClientsResponse>(getClientsEndpoint, {
    params: {
      page,
      size,
      deleted,
      minified,
      store_id: store_id || undefined,
      name: name || undefined,
      branch_id: Number(branch_id) || undefined,
      phone: phone || undefined,
    },
  });
  return response.data;
};
