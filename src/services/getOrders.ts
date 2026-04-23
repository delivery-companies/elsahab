import { api } from "@/api";
import { getOrdersEndpoint } from "@/api/apisUrl";
import type { deliveryTypesArabicNames } from "@/lib/deliveryTypesArabicNames";
import { getReportParam } from "@/lib/getReportParam";
import type { governorateArabicNames } from "@/lib/governorateArabicNames ";
import type { orderSecondaryStatusArabicNames } from "@/lib/orderSecondaryStatusArabicNames";
import type { orderStatusArabicNames } from "@/lib/orderStatusArabicNames";
import type { Filters } from "./getEmployeesService";

export interface Order {
  id: string;
  totalCost: number;
  paidAmount: number;
  totalCostInUSD: number;
  paidAmountInUSD: number;
  discount: number;
  receiptNumber: string;
  quantity: number;
  weight: number;
  recipientName: string;
  recipientPhones: string[];
  recipientAddress: string;
  details: string;
  notes: string;
  status: keyof typeof orderStatusArabicNames;
  secondaryStatus: keyof typeof orderSecondaryStatusArabicNames;
  deliveryType: keyof typeof deliveryTypesArabicNames;
  clientID: number;
  deliveryAgentID: number;
  deliveryDate: string | null;
  governorate: keyof typeof governorateArabicNames;
  forwardedRepo: number | null;
  forwardedToMainRepo: boolean;
  forwardedToGov: boolean;
  location: {
    id: number;
    name: string;
  } | null;
  repository: {
    id: number;
    name: string;
  } | null;
  locationID: number;
  storeID: number;
  deliveryCost: string;
  branch: {
    id: number;
    name: string;
  } | null;
  clientNet: string;
  companyNet: string;
  deliveryAgent: {
    id: number;
    name: string;
    phone: string;
    deliveryCost: string;
  } | null;
  products: {
    productID: number;
    quantity: number;
    color: string;
    size: string;
  }[];
  deleted?: boolean;
  deletedAt?: string | null;
  deletedBy: {
    id: number;
    name: string;
  };
  clientReport:
    | {
        deleted: boolean;
        id: number;
        clientId: number;
        storeId: number;
        secondaryType: string;
        url: string | null;
      }[]
    | null;
  repositoryReport:
    | {
        deleted: boolean;
        id: number;
        repositoryId: number;
        secondaryType: string;
        url: string | null;
      }[]
    | null;
  governorateReport: {
    deleted: boolean;
    id: number;
    governorate: keyof typeof governorateArabicNames;
    url: string | null;
  };
  branchReport: {
    deleted: boolean;
    id: number;
    branchId: number;
    type: string;
    url: string | null;
  }[];
  deliveryAgentReport: {
    deleted: boolean;
    id: number;
    deliveryAgentId: number;
    url: string | null;
  };
  companyReport: {
    deleted: boolean;
    id: number;
    companyId: number;
    secondaryType: string;
    url: string | null;
  }[];
  client: {
    id: number;
    name: string;
    phone: string;
    company: string;
    branch: string;
  };
  store: {
    id: number;
    name: string;
  };
  confirmed: boolean;
  inquiryEmployees: OrderInquiryEmployee[];
  forwarded: boolean;
  forwardedAt: string | null;
  forwardedBy: {
    id: number;
    name: string;
  } | null;
  forwardedFrom: {
    id: number;
    name: string;
  } | null;
  createdAt: string;
  updatedAt: string;
  processed: boolean;
  processedAt: string | null;
  processedBy: {
    id: number;
    name: string;
    phone: string;
  } | null;
}

export interface OrderInquiryEmployee {
  id: number;
  name: string;
  phone: string;
  avatar: string | null;
}

export interface OrdersMetaData {
  count: number;
  totalCost: number;
  paidAmount: number;
  clientNet: number;
  deliveryCost: number;
  countByStatus: Array<{
    status: keyof typeof orderStatusArabicNames;
    count: number;
  }>;
}

export interface GetOrdersResponse {
  status: string;
  page: number;
  pagesCount: number;
  data: {
    orders: Order[];
    count?: number;
    ordersMetaData: OrdersMetaData;
  };
}

export interface GetOrdersStatisticsResponse {
  status: string;
  data: {
    count: number;
    repositoryId: number | null;
    repoName: string | undefined;
  }[];
}

export interface OrdersFilter extends Filters {
  order_id?: string;
  processingStatus?: string | null;
  receipt_numbers?: string[];
  forwarded_by_id?: string;
  forwarded_from_id?: string;
  search?: string;
  sort?: string;
  start_date?: Date | string | null;
  end_date?: Date | string | null;
  delivery_end_date?: Date | string | null;
  delivery_start_date?: Date | string | null;
  delivery_date?: Date | string | null;
  governorate?: string;
  status?: string;
  secondaryStatus?: string;
  statuses?: string[];
  secondaryStatuses?: string[];
  delivery_type?: string;
  delivery_agent_id?: string;
  client_id?: string;
  store_id?: string;
  product_id?: string;
  location_id?: string;
  updated_by?: string;
  created_by?: string;
  receipt_number?: string;
  recipient_name?: string;
  recipient_phone?: string;
  recipient_address?: string;
  deleted?: boolean;
  removeRepeated?: boolean;
  client_report?: string | null;
  repository_report?: string | null;
  branch_report?: string | null;
  delivery_agent_report?: string | null;
  governorate_report?: string | null;
  company_report?: string | null;
  branch_id?: string | null;
  automatic_update_id?: string | null;
  confirmed?: boolean;
  company_id?: string;
  repository_id?: string | null;
  to_repository_id?: string | null;
  from?: string;
  forwarded?: boolean;
  forwardedToGov?: boolean;
  getIncoming?: boolean;
  getOutComing?: boolean;
  forChilds?: boolean;
  delivered?: boolean;
  orderType?: string;
  notes?: string;
}

export const getOrdersService = async (
  {
    order_id,
    page = 1,
    size = 10,
    search,
    sort,
    start_date,
    end_date,
    delivery_date,
    governorate,
    status,
    delivery_type,
    delivery_agent_id,
    client_id,
    store_id,
    product_id,
    location_id,
    receipt_number,
    recipient_name,
    recipient_phone,
    recipient_address,
    deleted = false,
    statuses,
    client_report,
    repository_report,
    branch_report,
    delivery_agent_report,
    governorate_report,
    company_report,
    branch_id,
    automatic_update_id,
    secondaryStatuses,
    secondaryStatus,
    confirmed = true,
    company_id,
    repository_id,
    from,
    forwarded,
    forwarded_by_id,
    forwarded_from_id,
    receipt_numbers,
    processingStatus,
    delivered,
    orderType,
    delivery_start_date,
    delivery_end_date,
    updated_by,
    created_by,
    notes,
    removeRepeated,
    forChilds,
  }: OrdersFilter = { page: 1, size: 10 },
) => {
  const response = await api.get<GetOrdersResponse>(getOrdersEndpoint, {
    params: {
      page,
      size,
      secondaryStatus: secondaryStatus || undefined,
      search: search || undefined,
      sort: sort || undefined,
      start_date: start_date || undefined,
      end_date: end_date || undefined,
      delivery_start_date: delivery_start_date || undefined,
      delivery_end_date: delivery_end_date || undefined,
      delivery_date: delivery_date || undefined,
      governorate: governorate || undefined,
      status: status || undefined,
      delivered: delivered || undefined,
      delivery_type: delivery_type || undefined,
      delivery_agent_id: delivery_agent_id || undefined,
      client_id: client_id || undefined,
      store_id: store_id || undefined,
      product_id: product_id || undefined,
      location_id: location_id || undefined,
      receipt_number: receipt_number || undefined,
      recipient_name: recipient_name || undefined,
      recipient_phone: recipient_phone || undefined,
      recipient_address: recipient_address || undefined,
      updated_by: updated_by || undefined,
      created_by: created_by || undefined,
      orderType: orderType || undefined,
      notes: notes || undefined,
      deleted,
      removeRepeated,
      order_id: order_id ? order_id : undefined,
      processingStatus: processingStatus || undefined,
      statuses: statuses?.join(",") || undefined,
      secondaryStatuses: secondaryStatuses?.join(",") || undefined,
      client_report: getReportParam(client_report),
      repository_report: getReportParam(repository_report),
      branch_report: getReportParam(branch_report),
      delivery_agent_report: getReportParam(delivery_agent_report),
      governorate_report: getReportParam(governorate_report),
      company_report: getReportParam(company_report),
      branch_id: branch_id || undefined,
      automatic_update_id: automatic_update_id || undefined,
      confirmed: forwarded_from_id
        ? undefined
        : from === "DELETED"
          ? undefined
          : confirmed,
      company_id: company_id || undefined,
      repository_id: repository_id || undefined,
      forwarded: forwarded || undefined,
      forwarded_by_id: forwarded_by_id || undefined,
      forwarded_from_id: forwarded_from_id || undefined,
      receipt_numbers: receipt_numbers?.length
        ? receipt_numbers.join(",")
        : undefined,
      forChilds,
    },
  });
  return response.data;
};

export const getRepositoryOrders = async (
  {
    page = 1,
    size = 10,
    client_id,
    store_id,
    repository_id,
    forwarded,
    governorate,
    secondaryStatus,
    status,
    forwardedToGov,
    getIncoming,
    getOutComing,
    to_repository_id,
    branch_id,
    forChilds,
  }: OrdersFilter = { page: 1, size: 10 },
) => {
  const response = await api.get<GetOrdersResponse>(
    "/orders/repositoryOrders",
    {
      params: {
        page,
        size,
        client_id: client_id || undefined,
        store_id: store_id || undefined,
        governorate: governorate || undefined,
        repository_id: repository_id || undefined,
        to_repository_id: to_repository_id || undefined,
        forwardedToGov: forwardedToGov || undefined,
        forwarded: forwarded || undefined,
        secondaryStatus: secondaryStatus,
        status: status || undefined,
        getIncoming: getIncoming || undefined,
        getOutComing: getOutComing || undefined,
        branchId: branch_id || undefined,
        forChilds,
      },
    },
  );

  return response.data;
};

export const getRepositoryOrdersStatistics = async (
  {
    page = 1,
    size = 10,
    client_id,
    store_id,
    repository_id,
    forwarded,
    governorate,
    secondaryStatus,
    status,
    forwardedToGov,
    getIncoming,
    getOutComing,
    to_repository_id,
    branch_id,
    type,
  }: OrdersFilter = { page: 1, size: 10 },
) => {
  const response = await api.get<GetOrdersStatisticsResponse>(
    "/orders/returnedRepositoryStatusStatistics",
    {
      params: {
        page,
        size,
        client_id: client_id || undefined,
        store_id: store_id || undefined,
        governorate: governorate || undefined,
        repository_id: repository_id || undefined,
        to_repository_id: to_repository_id || undefined,
        forwardedToGov: forwardedToGov || undefined,
        forwarded: forwarded || undefined,
        secondaryStatus: secondaryStatus,
        status: status || undefined,
        getIncoming: getIncoming || undefined,
        getOutComing: getOutComing || undefined,
        branchId: branch_id || undefined,
        type: type || undefined,
      },
    },
  );

  return response.data;
};
export interface storeOrders {
  store: {
    id: number;
    name: string;
  };
  client: {
    id: number | undefined;
    name: string | undefined;
  };
  count: number;
  totalCost: number;
  paidAmount: number;
  clientNet: number;
  deliveryAgentNet: number;
  companyNet: number;
  deliveryCost: number;
}
export interface GetOrdersStoresResponse {
  status: string;
  data: storeOrders[];
}
export const getRecevingAgentStores = async (
  receivingAgentId?: string,
  clientId?: string,
  storeId?: string,
) => {
  const response = await api.get<GetOrdersStoresResponse>(
    "/orders/getByStore",
    {
      params: {
        receivingAgentId: receivingAgentId || undefined,
        clientId: clientId || undefined,
        storeId: storeId || undefined,
      },
    },
  );

  return response.data;
};
