/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react-hooks/rules-of-hooks */
import { useCreateReportsDocumentation } from "@/hooks/useCreateReportsDocumentation";
import type { IDeliveryAgentManifest } from "@/services/getDeliveryAgentManifest";
import { useManifestStore } from "@/store/manifestStore";
import { Button } from "@mantine/core";
import type { ColumnDef } from "@tanstack/react-table";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const columns: ColumnDef<IDeliveryAgentManifest>[] = [
  {
    accessorKey: "id",
    header: "#",
  },
  {
    accessorKey: "name",
    header: "اسم المندوب",
  },
  {
    accessorKey: "ordersCount",
    header: "عدد الطلبيات",
  },
  {
    id: "ordersPageLink",
    header: "الطلبيات",
    cell: ({ row }) => {
      const { id } = row.original;
      const navigation = useNavigate();
      const { orders_end_date, orders_start_date, branch_id } =
        useManifestStore();
      const handleClick = () => {
        navigation("/orders", {
          state: {
            delivery_agent_id: id,
            delivery_end_date: orders_end_date,
            delivery_start_date: orders_start_date,
            branch_id,
          },
        });
      };
      return <Button onClick={handleClick}>عرض الطلبيات</Button>;
    },
  },
  {
    id: "createManifest",
    header: "تحميل مانفيست",
    cell: ({ row }) => {
      const { id } = row.original;
      const { orders_end_date, orders_start_date } = useManifestStore();
      const { mutateAsync: crateDeliveryAgentManifest, isLoading } =
        useCreateReportsDocumentation();

      const handleCreateDeliveryAgentManifest = async () => {
        toast.promise(
          crateDeliveryAgentManifest({
            type: "DELIVERY_AGENT_MANIFEST",
            params: {
              delivery_agent_id: id,
              delivery_end_date: orders_end_date || undefined,
              delivery_start_date: orders_start_date || undefined,
            },
            ordersIDs: "*",
          }),
          {
            loading: "جاري تحميل تقرير...",
            success: "تم تحميل تقرير بنجاح",
            error: (error) => error.message || "حدث خطأ ما",
          }
        );
      };

      const hasOrders = row.original.ordersCount > 0;

      return (
        <Button
          onClick={handleCreateDeliveryAgentManifest}
          disabled={isLoading || !hasOrders}>
          تحميل مانفيست
        </Button>
      );
    },
  },
];
