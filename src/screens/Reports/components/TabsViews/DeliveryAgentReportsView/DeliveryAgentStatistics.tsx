import { useCreateReport } from "@/hooks/useCreateReport";
import { transformOrdersFilterToMatchReportParams } from "@/lib/transformOrdersFilterToMatchReportParams";
import type { CreateReportPayload } from "@/services/createReport";
import type { OrdersFilter, OrdersMetaData } from "@/services/getOrders";
import { Button, Grid, NumberInput } from "@mantine/core";
import { useState } from "react";
import toast from "react-hot-toast";
import { StatisticsItem } from "../../StatisticsItem";

interface DeliveryAgentOrdersStatisticsProps {
    ordersParams: OrdersFilter;
    ordersLength: number;
    deliveryAgentID: string;
    ordersMetaData: OrdersMetaData;
}

export const DeliveryAgentStatistics = ({
    ordersLength,
    ordersParams,
    deliveryAgentID,
    ordersMetaData
}: DeliveryAgentOrdersStatisticsProps) => {
    const [deliveryAgentDeliveryCost, setDeliveryAgentDeliveryCost] = useState<number | string>(0);

    const { mutateAsync: createReport, isLoading } = useCreateReport();

    const handleCreateReport = () => {
        if (!deliveryAgentDeliveryCost) {
            toast.error("الرجاء ادخال اجور التوصيل");
            return;
        }
        const mutationParams: CreateReportPayload = {
            ordersIDs: "*",
            params: transformOrdersFilterToMatchReportParams(ordersParams),
            type: "DELIVERY_AGENT",
            deliveryAgentDeliveryCost: Number(deliveryAgentDeliveryCost),
            deliveryAgentID: Number(deliveryAgentID)
        };

        toast.promise(
            createReport(mutationParams, {
                onSuccess: () => {
                    setDeliveryAgentDeliveryCost(0);
                }
            }),
            {
                loading: "جاري تصدير الكشف",
                success: "تم تصدير الكشف بنجاح",
                error: (error) => error.message || "حدث خطأ ما"
            }
        );
    };
    return (
        <Grid align="center" className="mt-4" grow>
            <Grid.Col span={{ md: 3, lg: 2, sm: 6, xs: 6 }}>
                <StatisticsItem title="عدد الطلبيات" value={ordersMetaData.count} />
            </Grid.Col>
            <Grid.Col span={{ md: 3, lg: 2, sm: 6, xs: 6 }}>
                <StatisticsItem title="المبلغ الكلي" value={ordersMetaData.totalCost} />
            </Grid.Col>
            <Grid.Col span={{ md: 3, lg: 2, sm: 6, xs: 6 }}>
                <StatisticsItem title="المبلغ المدفوع" value={ordersMetaData.paidAmount || 0} />
            </Grid.Col>
            <Grid.Col span={{ md: 3, lg: 2, sm: 6, xs: 6 }}>
                <StatisticsItem title="مبلغ التوصيل" value={ordersMetaData.deliveryCost} />
            </Grid.Col>
            <Grid.Col span={{ md: 3, lg: 2, sm: 6, xs: 6 }}>
                <StatisticsItem title="صافي العميل" value={ordersMetaData.clientNet} />
            </Grid.Col>
            <Grid.Col span={{ md: 3, lg: 2, sm: 6, xs: 6 }}>
                <NumberInput
                    label="اجور توصيل المندوب"
                    value={deliveryAgentDeliveryCost}
                    onChange={(e) => setDeliveryAgentDeliveryCost(e)}
                    placeholder="اجور توصيل المندوب"
                />
            </Grid.Col>
            <Grid.Col className="mt-6" span={{ md: 3, lg: 2, sm: 6, xs: 6 }}>
                <Button
                    disabled={ordersLength === 0 || isLoading || !deliveryAgentID}
                    onClick={handleCreateReport}
                    loading={isLoading}
                >
                    انشاء كشف مندوب توصيل
                </Button>
            </Grid.Col>
        </Grid>
    );
};
