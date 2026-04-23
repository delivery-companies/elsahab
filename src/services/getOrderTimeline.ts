import { api } from "@/api";
import { getOrderDetailsEndpoint } from "@/api/apisUrl";
import type { orderStatusArabicNames } from "@/lib/orderStatusArabicNames";
import type { reportTypeArabicNames } from "@/lib/reportTypeArabicNames";
import type { rolesArabicNames } from "@/lib/rolesArabicNames";

export type OrderTimelineType =
    | "STATUS_CHANGE"
    | "DELIVERY_AGENT_CHANGE"
    | "CURRENT_LOCATION_CHANGE"
    | "PAID_AMOUNT_CHANGE"
    | "REPOSITORY_CHANGE"
    | "BRANCH_CHANGE"
    | "CLIENT_CHANGE"
    | "STATUS_CHANGE"
    | "REPORT_CREATE"
    | "REPORT_DELETE"
    | "ORDER_DELIVERY"
    | "OTHER";

export const orderTimelineTypeArabicNames = {
    STATUS_CHANGE: "تغيير حالة الطلب",
    DELIVERY_AGENT_CHANGE: "تغيير مندوب التوصيل",
    CURRENT_LOCATION_CHANGE: "تغيير الموقع الحالي",
    ORDER_DELIVERY: "توصيل الطلب",
    REPORT_CREATE: "إنشاء كشف",
    REPORT_DELETE: "حذف كشف",
    PAID_AMOUNT_CHANGE: "تغيير المبلغ المدفوع",
    REPOSITORY_CHANGE: "تغيير المخزن",
    BRANCH_CHANGE: "تغيير الفرع",
    CLIENT_CHANGE: "تغيير العميل",
    OTHER: "أخرى"
};

export interface OrderTimeline {
    status: string;
    data: {
        new: keyof typeof orderStatusArabicNames | number | string;
        old: keyof typeof orderStatusArabicNames | number | string;
        by: {
            id: number;
            name: string;
            role: keyof typeof rolesArabicNames;
        };
        date: string;
        type: OrderTimelineType;
        reportID: number | null;
        reportType: keyof typeof reportTypeArabicNames | null;
        message: string | null;
    }[];
}

export const getOrderTimeline = async (orderId: string) => {
    const response = await api.get<OrderTimeline>(`${getOrderDetailsEndpoint}${orderId}/timeline`);
    return response.data;
};
