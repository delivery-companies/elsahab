import { useClientByStoreId } from "@/hooks/useClients";
import { useCreateReport } from "@/hooks/useCreateReport";
import { transformOrdersFilterToMatchReportParams } from "@/lib/transformOrdersFilterToMatchReportParams";
import type { CreateReportPayload } from "@/services/createReport";
import type {
  OrdersFilter,
  OrdersMetaData,
  storeOrders,
} from "@/services/getOrders";
import { useAuth } from "@/store/authStore";
import { Button, Grid, NumberInput } from "@mantine/core";
import { RowSelectionState } from "@tanstack/react-table";
import { useState } from "react";
import toast from "react-hot-toast";
// import { StatisticsItem } from "../../StatisticsItem";

interface ClientOrdersStatisticsProps {
  storeID: string;
  ordersMetaData?: OrdersMetaData;
  ordersParams: OrdersFilter;
  ordersLength: number;
  stores: storeOrders[];
  selectedStores: RowSelectionState;
}

export const ClientOrdersStatistics = ({
  //   ordersMetaData,
  ordersLength,
  ordersParams,
  selectedStores,
  stores,
}: ClientOrdersStatisticsProps) => {
  const { role } = useAuth();
  const [baghdadDeliveryCost, setBaghdadDeliveryCost] = useState<
    number | string | undefined
  >(undefined);
  const [governoratesDeliveryCost, setGovernoratesDeliveryCost] = useState<
    number | string | undefined
  >(undefined);
  const { mutateAsync: createReport, isLoading } = useCreateReport();
  const { mutateAsync: getClientId } = useClientByStoreId();

  const handleCreateReport = async () => {
    const selectedStoreIds = Object.keys(selectedStores)
      .filter((key) => selectedStores[key])
      .map((key) => stores[Number(key)].store.id);

    if (selectedStoreIds.length === 0) {
      toast.error("قم بتحديد المتاجر اولا");
      return;
    }

    toast.promise(
      Promise.all(
        selectedStoreIds.map(async (id) => {
          const { data } = await getClientId(String(id));
          if (!data?.length) {
            throw new Error(`لا يوجد عميل للمتجر ${id}`);
          }

          const mutationParams: CreateReportPayload = {
            ordersIDs: "*",
            params: transformOrdersFilterToMatchReportParams({
              ...ordersParams,
              delivery_agent_id: undefined,
              client_id: undefined,
              store_id: String(id),
            }),
            type: "CLIENT",
            storeID: id,
            clientID: data[0].id,
            baghdadDeliveryCost: baghdadDeliveryCost
              ? Number(baghdadDeliveryCost)
              : undefined,
            governoratesDeliveryCost: governoratesDeliveryCost
              ? Number(governoratesDeliveryCost)
              : undefined,
          };

          await createReport(mutationParams);

          // Reset after success
          setBaghdadDeliveryCost(undefined);
          setGovernoratesDeliveryCost(undefined);
        })
      ),
      {
        loading: "جاري تصدير الكشوفات",
        success: "تم تصدير جميع الكشوفات بنجاح",
        error: (error) => error.message || "حدث خطأ أثناء التصدير",
      }
    );
  };

  return (
    <Grid align="center" className="mt-4" grow>
      {/* <Grid.Col span={{ md: 3, lg: 2, sm: 6, xs: 6 }}>
                <StatisticsItem title="عدد الطلبيات" value={ordersMetaData.count || 0} />
            </Grid.Col>
            <Grid.Col span={{ md: 3, lg: 2, sm: 6, xs: 6 }}>
                <StatisticsItem title="المبلغ الكلي" value={ordersMetaData.totalCost || 0} />
            </Grid.Col>
            <Grid.Col span={{ md: 3, lg: 2, sm: 6, xs: 6 }}>
                <StatisticsItem title="المبلغ المدفوع" value={ordersMetaData.paidAmount || 0} />
            </Grid.Col>
            <Grid.Col span={{ md: 3, lg: 2, sm: 6, xs: 6 }}>
                <StatisticsItem title="مبلغ التوصيل" value={ordersMetaData.deliveryCost || 0} />
            </Grid.Col>
            <Grid.Col span={{ md: 3, lg: 2, sm: 6, xs: 6 }}>
                <StatisticsItem title="صافي العميل" value={ordersMetaData.clientNet || 0} />
            </Grid.Col>
            <Grid.Col span={{ md: 3, lg: 2, sm: 6, xs: 6 }}>
                <StatisticsItem
                    title="عدد الطلبات الواصلة"
                    value={
                        (ordersMetaData?.countByStatus?.find((status) => status.status === "DELIVERED")?.count ?? 0) +
                        (ordersMetaData?.countByStatus?.find((status) => status.status === "REPLACED")?.count ?? 0) +
                        (ordersMetaData?.countByStatus?.find((status) => status.status === "PARTIALLY_RETURNED")?.count ?? 0)
                    }
                />
            </Grid.Col> */}
      {role !== "CLIENT" && (
        <>
          <Grid.Col span={{ md: 3, lg: 2, sm: 6, xs: 6 }}>
            <NumberInput
              label="اجور توصيل بغداد"
              value={baghdadDeliveryCost}
              onChange={(e) => setBaghdadDeliveryCost(e)}
              placeholder="اجور توصيل بغداد"
            />
          </Grid.Col>
          <Grid.Col span={{ md: 3, lg: 2, sm: 6, xs: 6 }}>
            <NumberInput
              label="اجور توصيل المحافظات"
              value={governoratesDeliveryCost}
              onChange={(e) => setGovernoratesDeliveryCost(e)}
              placeholder="اجور توصيل المحافظات"
            />
          </Grid.Col>
          <Grid.Col className="mt-6" span={{ md: 3, lg: 2, sm: 6, xs: 6 }}>
            <Button
              disabled={ordersLength === 0 || isLoading}
              onClick={handleCreateReport}
              loading={isLoading}>
              انشاء كشف عميل
            </Button>
          </Grid.Col>
        </>
      )}
    </Grid>
  );
};
