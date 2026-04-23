import { api } from "@/api";
import { getEmployeesEndpoint } from "@/api/apisUrl";
import type { governorateArabicNames } from "@/lib/governorateArabicNames ";
import type { permissionsArabicNames } from "@/lib/persmissionArabicNames";

export interface IDeliveryAgentManifest {
  id: number;
  name: string;
  username: string;
  phone: string;
  avatar: string | null;
  salary: string;
  role: string;
  permissions: (keyof typeof permissionsArabicNames)[];
  deliveryCost: string;
  branch: Branch;
  repository: Repository;
  company: Company;
  deleted: boolean;
  deletedBy: boolean;
  deletedAt: boolean;
  ordersCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Branch {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  email: string;
  phone: string;
  governorate: keyof typeof governorateArabicNames;
  companyId: number;
}

export interface Repository {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  branchId: number;
  companyId: number;
}

export interface Company {
  id: number;
  name: string;
  logo: string;
}

export interface ManifestFilters {
  page?: number;
  size?: number;
  pagesCount?: number;
  orders_start_date?: string;
  delivery_start_date?: string;
  delivery_end_date?: string;
  orders_end_date?: string;
  branch_id?: number;
}

export interface IDeliveryAgentManifestResponse {
  status: string;
  page: number;
  pagesCount: number;
  data: IDeliveryAgentManifest[];
}

export const getDeliveryAgentManifest = async ({
  page = 1,
  size = 10,
  orders_start_date,
  orders_end_date,
  branch_id,
}: ManifestFilters = {}) => {
  const response = await api.get<IDeliveryAgentManifestResponse>(
    getEmployeesEndpoint,
    {
      params: {
        roles: "DELIVERY_AGENT",
        page,
        size,
        orders_start_date: orders_start_date || undefined,
        orders_end_date: orders_end_date || undefined,
        branch_id: branch_id || undefined,
      },
    }
  );
  return response.data;
};
