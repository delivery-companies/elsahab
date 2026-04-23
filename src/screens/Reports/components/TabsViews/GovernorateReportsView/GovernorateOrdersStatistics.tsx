import { useCreateReport } from "@/hooks/useCreateReport";
import type { governorateArabicNames } from "@/lib/governorateArabicNames ";
import { transformOrdersFilterToMatchReportParams } from "@/lib/transformOrdersFilterToMatchReportParams";
import type { CreateReportPayload } from "@/services/createReport";
import type { OrdersFilter, OrdersMetaData } from "@/services/getOrders";
import { Button, Grid, NumberInput } from "@mantine/core";
import { useState } from "react";
import toast from "react-hot-toast";
import { StatisticsItem } from "../../StatisticsItem";

interface GovernorateOrdersStatisticsProps {
  ordersParams: OrdersFilter;
  ordersLength: number;
  governorate: keyof typeof governorateArabicNames;
  ordersMetaData: OrdersMetaData;
}

export const GovernorateOrdersStatistics = ({
  ordersLength,
  ordersParams,
  governorate,
  ordersMetaData,
}: GovernorateOrdersStatisticsProps) => {
  const [baghdadDeliveryCost, setBaghdadDeliveryCost] = useState<
    number | string | undefined
  >(undefined);
  const [governoratesDeliveryCost, setGovernoratesDeliveryCost] = useState<
    number | string | undefined
  >(undefined);
  const { mutateAsync: createReport, isLoading } = useCreateReport();

  const handleCreateReport = () => {
    const mutationParams: CreateReportPayload = {
      ordersIDs: "*",
      params: transformOrdersFilterToMatchReportParams(ordersParams),
      type: "GOVERNORATE",
      governorate,
      baghdadDeliveryCost: Number(baghdadDeliveryCost),
      governoratesDeliveryCost: Number(governoratesDeliveryCost),
    };
    toast.promise(
      createReport(mutationParams, {
        onSuccess: () => {
          setBaghdadDeliveryCost(0);
          setGovernoratesDeliveryCost(0);
        },
      }),
      {
        loading: "جاري تصدير الكشف",
        success: "تم تصدير الكشف بنجاح",
        error: (error) => error.message || "حدث خطأ ما",
      }
    );
  };
  return (
    <Grid align="center" className="mt-4" grow>
      <Grid.Col span={{ base: 6, md: 3, lg: 2, sm: 12, xs: 12 }}>
        <StatisticsItem title="عدد الطلبيات" value={ordersMetaData.count} />
      </Grid.Col>
      <Grid.Col span={{ base: 6, md: 3, lg: 2, sm: 12, xs: 12 }}>
        <StatisticsItem title="المبلغ الكلي" value={ordersMetaData.totalCost} />
      </Grid.Col>
      <Grid.Col span={{ md: 3, lg: 2, sm: 6, xs: 6 }}>
        <StatisticsItem
          title="المبلغ المدفوع"
          value={ordersMetaData.paidAmount || 0}
        />
      </Grid.Col>
      <Grid.Col span={{ base: 6, md: 3, lg: 2, sm: 12, xs: 12 }}>
        <StatisticsItem
          title="مبلغ التوصيل"
          value={ordersMetaData.deliveryCost}
        />
      </Grid.Col>
      <Grid.Col span={{ base: 6, md: 3, lg: 2, sm: 12, xs: 12 }}>
        <StatisticsItem title="صافي العميل" value={ordersMetaData.clientNet} />
      </Grid.Col>
      <Grid.Col span={{ md: 3, lg: 3, sm: 6, xs: 6 }}>
        <NumberInput
          label="اجور توصيل بغداد"
          value={baghdadDeliveryCost}
          onChange={(e) => setBaghdadDeliveryCost(e)}
          placeholder="اجور توصيل بغداد"
        />
      </Grid.Col>
      <Grid.Col span={{ md: 3, lg: 3, sm: 6, xs: 6 }}>
        <NumberInput
          label="اجور توصيل المحافظات"
          value={governoratesDeliveryCost}
          onChange={(e) => setGovernoratesDeliveryCost(e)}
          placeholder="اجور توصيل المحافظات"
        />
      </Grid.Col>
      <Grid.Col span={{ base: 6, md: 3, lg: 2, sm: 12, xs: 12 }}>
        <Button
          disabled={ordersLength === 0 || isLoading || !governorate}
          onClick={handleCreateReport}
          loading={isLoading}>
          انشاء كشف محافظة
        </Button>
      </Grid.Col>
    </Grid>
  );
};
