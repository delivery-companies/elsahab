import { api } from "@/api";
import { ordersStatisticsEndpoint } from "@/api/apisUrl";
import type { deliveryTypesArabicNames } from "@/lib/deliveryTypesArabicNames";
import { getReportParam } from "@/lib/getReportParam";
import type { governorateArabicNames } from "@/lib/governorateArabicNames ";
import type { orderStatusArabicNames } from "@/lib/orderStatusArabicNames";

export interface OrdersStatistics {
    ordersStatisticsByStatus: {
        status: keyof typeof orderStatusArabicNames;
        totalCost: string;
        count: number;
    }[];
    ordersStatisticsByGovernorate: {
        governorate: keyof typeof governorateArabicNames;
        totalCost: string;
        count: number;
    }[];
    allOrdersStatistics: {
        totalCost: string;
        count: number;
    };
    allOrdersStatisticsWithoutClientReport: {
        totalCost: string;
        count: number;
    };
    todayOrdersStatistics: {
        totalCost: string;
        count: number;
    };
}

export interface OrdersStatisticsResponse {
    status: string;
    data: OrdersStatistics;
}

export interface OrdersStatisticsFilter {
    store_id?: number;
    tenant_id?: number;
    start_date?: Date | string | null;
    end_date?: Date | string | null;
    recorded?: string;
    statuseses?: (keyof typeof orderStatusArabicNames)[];
    delivery_type?: keyof typeof deliveryTypesArabicNames;
    location_id?: number;
    client_id?: number;
    company_id?: number;
    client_report?: string | null;
    branch_report?: string | null;
    repository_report?: string | null;
    delivery_agent_report?: string | null;
    governorate_report?: string | null;
    company_report?: string | null;
    governorate?: string;
}

export const getOrdersStatisticsService = async (filters: OrdersStatisticsFilter) => {
    const response = await api.get<OrdersStatisticsResponse>(ordersStatisticsEndpoint, {
        params: {
            store_id: filters?.store_id || undefined,
            tenant_id: filters?.tenant_id || undefined,
            start_date: filters?.start_date || undefined,
            end_date: filters?.end_date || undefined,
            recorded: filters?.recorded || undefined,
            statuseses: filters.statuseses?.join(",") || undefined,
            client_report: getReportParam(filters.client_report),
            repository_report: getReportParam(filters.repository_report),
            branch_report: getReportParam(filters.branch_report),
            delivery_agent_report: getReportParam(filters.delivery_agent_report),
            governorate_report: getReportParam(filters.governorate_report),
            company_report: getReportParam(filters.company_report),
            delivery_type: filters.delivery_type || undefined,
            location_id: filters.location_id || undefined,
            client_id: filters.client_id || undefined,
            company_id: filters.company_id || undefined,
            governorate: filters.governorate || undefined
        }
    });
    return response.data;
};
