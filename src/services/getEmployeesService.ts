import { api } from "@/api";
import { getEmployeesEndpoint } from "@/api/apisUrl";
import type { EmployeesFilters } from "@/hooks/useEmployees";
import { orderStatusArabicNames } from "@/lib/orderStatusArabicNames";
import type { permissionsArabicNames } from "@/lib/persmissionArabicNames";
import type { rolesArabicNames } from "@/lib/rolesArabicNames";

export interface Employee {
  id: number;
  name: string;
  username: string;
  phone: string;
  orderType?: string;
  clientAssistantRole: string;
  salary: number;
  role: keyof typeof rolesArabicNames;
  emergency?: boolean | undefined;
  mainEmergency?: boolean | undefined;
  avatar: string | null;
  idCard: string | null;
  residencyCard: string | null;
  permissions: (keyof typeof permissionsArabicNames)[];
  orderStatus: (keyof typeof orderStatusArabicNames)[];
  branchId: number;
  branch: {
    id: number;
    name: string;
    email: string;
    phone: string;
    governorate: string;
    createdAt: string;
    updatedAt: string;
  };
  deliveryCost: number;
  company: {
    id: number;
    name: string;
    logo: string | null;
  };
  repository: {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    branchId: string;
  };
  deleted?: boolean;
  deletedBy?: {
    id: number;
    name: string;
  };
  deletedAt?: string;
  managedStores: {
    id: number;
    name: string;
  }[];
  inquiryBranches: {
    id: number;
    name: string;
  }[];
  inquiryLocations: {
    id: number;
    name: string;
  }[];
  inquiryCompanies: {
    id: number;
    name: string;
  }[];
  inquiryStores: {
    id: number;
    name: string;
  }[];
  inquiryClients: {
    id: number;
    name: string;
  }[];
  inquiryDeliveryAgents: {
    id: number;
    name: string;
  }[];
  inquiryGovernorates: string[];
  inquiryStatuses: string[];
  createdBy: {
    id: number;
    name: string;
  } | null;
}

export interface GetEmployeesResponse {
  status: string;
  page: number;
  pagesCount: number;
  data: Employee[];
}

export interface Filters {
  page?: number;
  size?: number;
  pagesCount?: number;
  roles?: (keyof typeof rolesArabicNames)[];
  permissions?: (keyof typeof permissionsArabicNames)[];
  deleted?: boolean;
  minified?: boolean;
  store_id?: string;
  client_id?: string;
  branchId?: string | null;
  type?: string;
  name?: string;
}

export const getEmployeesService = async (
  {
    page = 1,
    size = 10,
    roles,
    deleted = false,
    branch_id,
    location_id,
    minified,
    permissions,
    name,
    phone,
  }: EmployeesFilters = {
    page: 1,
    size: 10,
  }
) => {
  const response = await api.get<GetEmployeesResponse>(getEmployeesEndpoint, {
    params: {
      page,
      size,
      roles: roles?.join(",") || undefined,
      deleted,
      branch_id: Number(branch_id) || undefined,
      location_id: Number(location_id) || undefined,
      minified,
      permissions: permissions?.join(",") || undefined,
      name: name || undefined,
      phone: phone || undefined,
    },
  });
  return response.data;
};
