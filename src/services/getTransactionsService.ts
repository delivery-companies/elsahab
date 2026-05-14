import { api } from "@/api";
import type { Filters } from "./getEmployeesService";
import { Report } from "./getReports";
import { OrdersFilter } from "./getOrders";

export interface Transaction {
  type: "DEPOSIT" | "WITHDRAW";
  for: string;
  paidAmount: number;
  employee: {
    user: {
      name: string;
      id: number;
    };
  } | null;
  company: {
    name: string;
    id: number;
  };
  id: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: {
    name: string;
    id: number;
  } | null;
}

export interface GetTransactionsResponse {
  status: string;
  page: number;
  pagesCount: number;
  totalDepoist: number;
  totalWithdraw: number;
  total: number;
  receivedFromAgents: number;
  notReceived: number;
  agentProfit: number;
  branchProfit: number;
  forClients: number;
  paidToClients: number;
  data: Report[];
}

export interface CompanyNetReport {
  employeeId: number;
  employeeName: string;
  totalCompanyNet: number;
  totalDeposit: number;
  totalWithdraw: number;
}

export interface GetCompanyNetReportsResponse {
  status: string;
  page: number;
  pagesCount: number;
  totalGroups: number;
  data: CompanyNetReport[];
}

export interface GetReceivingAgentClients {
  status: string;
  data: {
    total: number | undefined;
    deliveredTotal: number | undefined;
    name: string;
    branchProfit?: number;
  }[];
}

export interface TransactionFilters extends Filters {
  employee_id?: number;
  type?: string;
}

export const getTransactionsService = async (
  {
    page = 1,
    size = 10,
    delivery_agent_id,
    type,
    client_id,
    start_date,
    end_date,
  }: OrdersFilter = {
    page: 1,
    size: 10,
  }
) => {
  const response = await api.get<GetTransactionsResponse>("/transactions", {
    params: {
      page,
      size,
      deliveryAgentId: delivery_agent_id || undefined,
      clientId: client_id || undefined,
      type: type || undefined,
      start_date: start_date || undefined,
      end_date: end_date || undefined,
    },
  });

  return response.data;
};

export interface CompanyNetFilters {
  page?: number;
  size?: number;
}
export const getRecevingAgentClientService = async ({
  repository_id,
  start_date,
  end_date,
}: OrdersFilter) => {
  const response = await api.get<GetReceivingAgentClients>(
    "/receivingAgent-clients",
    {
      params: {
        receivingAgentId: repository_id || undefined,
        start_date: start_date || undefined,
        end_date: end_date || undefined,
      },
    }
  );
  return response.data;
};

export const getCompanyNetReportsService = async (
  { page = 1, size = 10 }: CompanyNetFilters = { page: 1, size: 10 }
) => {
  const response = await api.get<GetCompanyNetReportsResponse>(
    "/transactions/getWallets",
    {
      params: { page, size },
    }
  );
  return response.data;
};
