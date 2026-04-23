import { governorateArabicNames } from "@/lib/governorateArabicNames ";
import { orderSecondaryStatusArabicNames } from "@/lib/orderSecondaryStatusArabicNames";
import { orderStatusArabicNames } from "@/lib/orderStatusArabicNames";
import type { Order } from "@/services/getOrders";
import { useOrdersStore } from "@/store/returnsStors";
import { Checkbox, Flex, Text, rem } from "@mantine/core";
/* eslint-disable react-hooks/rules-of-hooks */
import type { ColumnDef } from "@tanstack/react-table";
import { OrdersFullDetails } from "../Orders/components/OrdersFullDetails";

export const columns: ColumnDef<Order>[] = [
  {
    id: "select",
    header: ({ table }) => {
      const { deleteAllOrders, setAllOrders, isOrderExist } = useOrdersStore();

      return (
        <Checkbox
          checked={
            table.getRowModel().rows.length > 0 &&
            table
              .getRowModel()
              .rows.every((row) => isOrderExist(row.original.id.toString()))
          }
          onChange={(event) => {
            const allTableRowsIds = table.getRowModel().rows.map((row) => ({
              id: row.original.id.toString(),
              name: row.original.recipientName,
            }));

            const isAllSelected = event.currentTarget.checked;

            if (isAllSelected) {
              setAllOrders(allTableRowsIds);
              table.toggleAllPageRowsSelected(true);
            } else {
              table.toggleAllPageRowsSelected(false);
              deleteAllOrders();
            }
          }}
        />
      );
    },
    cell: ({ row }) => {
      const { addOrder, deleteOrder, isOrderExist } = useOrdersStore();
      return (
        <div className="flex items-center gap-4">
          <Checkbox
            checked={isOrderExist(row.original.id.toString())}
            onChange={(value) => {
              const isChecked = value.currentTarget.checked;
              const { id, recipientName } = row.original;
              if (isChecked) {
                addOrder({ id: id.toString(), name: recipientName });
                row.toggleSelected(true);
              } else {
                row.toggleSelected(false);
                deleteOrder(id.toString());
              }
            }}
          />
          <OrdersFullDetails order={row.original} />
        </div>
      );
    },
  },
  {
    accessorKey: "id",
    header: "#",
  },
  {
    accessorKey: "receiptNumber",
    header: "رقم الوصل",
  },
  {
    accessorKey: "recipientPhones",
    header: "رقم الهاتف",
    cell: ({ row }) => {
      const { recipientPhones } = row.original;

      return recipientPhones.length > 0 ? (
        <Flex gap="xs">
          <Text size="sm">{recipientPhones[0]}</Text>
        </Flex>
      ) : (
        <Text size="sm">لا يوجد</Text>
      );
    },
  },
  {
    accessorKey: "deliveryAgent.name",
    header: "المندوب",
    cell: ({ row }) => {
      const { deliveryAgent } = row.original;
      if (!deliveryAgent) return <Text size="sm">--</Text>;
      return <Text size="sm">{deliveryAgent?.name || "--"}</Text>;
    },
  },
  {
    accessorKey: "client.name",
    header: "العميل",
  },
  {
    accessorKey: "store.name",
    header: "المتجر",
  },
  {
    header: "العنوان",
    cell: ({ row }) => {
      const { recipientAddress, governorate } = row.original;
      return (
        <Text truncate maw={rem(200)} size="sm">
          {governorateArabicNames[governorate]} - {recipientAddress}
        </Text>
      );
    },
  },
  {
    accessorKey: "status",
    header: "الحالة",
    accessorFn: ({ status, secondaryStatus, repository, deliveryAgent }) => {
      return `${orderStatusArabicNames[status]}  ${
        orderSecondaryStatusArabicNames[secondaryStatus]
          ? ` - ${orderSecondaryStatusArabicNames[secondaryStatus]} -  ${
              secondaryStatus === "IN_REPOSITORY"
                ? repository?.name
                : secondaryStatus === "WITH_AGENT"
                ? deliveryAgent?.name
                : ""
            }`
          : ""
      }`;
    },
  },
];
