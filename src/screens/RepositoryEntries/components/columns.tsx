import { governorateArabicNames } from "@/lib/governorateArabicNames ";
import { orderStatusArabicNames } from "@/lib/orderStatusArabicNames";
import type { Order } from "@/services/getOrders";
import { Button, Checkbox, Flex, Menu, Text, rem } from "@mantine/core";
/* eslint-disable react-hooks/rules-of-hooks */
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { OrdersFullDetails } from "@/screens/Orders/components/OrdersFullDetails";
import { OrderTimelineModal } from "@/screens/Orders/components/OrderTimelineModal";
import { useOrdersStore } from "@/store/returnsStors";

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
    accessorKey: "",
    header: "#",
    cell: ({ row }) => {
      return <Text size="sm">{row.index + 1}</Text>;
    },
  },
  {
    accessorKey: "id",
    header: "رقم الطلبيه",
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
    accessorKey: "client.name",
    header: "العميل",
    cell: ({ row }) => {
      const { client, store } = row.original;
      return (
        <Text
          truncate
          maw={rem(100)}
          size="sm"
          style={{
            width: "150px",
            overflow: "visible",
            maxWidth: "unset",
            whiteSpace: "wrap",
            fontSize: "12px",
            fontWeight: "bold",
          }}>
          {client.name + " | " + store.name}
        </Text>
      );
    },
  },
  {
    accessorKey: "client.company",
    header: "شركه العميل",
    cell: ({ row }) => {
      const { client } = row.original;
      return (
        <Text
          truncate
          maw={rem(100)}
          size="sm"
          style={{
            width: "150px",
            overflow: "visible",
            maxWidth: "unset",
            whiteSpace: "wrap",
            fontSize: "12px",
            fontWeight: "bold",
          }}>
          {client.company + " | " + client.branch}
        </Text>
      );
    },
  },
  {
    header: "المحافظه",
    cell: ({ row }) => {
      const { governorate } = row.original;
      return (
        <Text truncate maw={rem(200)} size="sm">
          {governorateArabicNames[governorate]}
        </Text>
      );
    },
  },
  {
    accessorKey: "status",
    header: "الحالة",
    accessorFn: ({ status, secondaryStatus, repository }) => {
      return `${
        secondaryStatus === "IN_REPOSITORY" &&
        (status === "IN_GOV_REPOSITORY" || status === "IN_MAIN_REPOSITORY")
          ? "في " + repository?.name
          : secondaryStatus === "IN_REPOSITORY"
          ? orderStatusArabicNames[status] + " " + "في " + repository?.name
          : secondaryStatus === "IN_CAR"
          ? "مرسل إلي " + repository?.name
          : secondaryStatus === "WITH_AGENT" &&
            status !== "WITH_DELIVERY_AGENT" &&
            status !== "WITH_RECEIVING_AGENT"
          ? orderStatusArabicNames[status] + "-" + "مع المندوب"
          : secondaryStatus === "WITH_CLIENT"
          ? orderStatusArabicNames[status] + "-" + "مع العميل"
          : orderStatusArabicNames[status]
      }`;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original;

      const [timelineOpened, { open: openTimeline, close: closeTimeline }] =
        useDisclosure(false);
      const [isMenuOpen, setMenuOpen] = useState(false);

      return (
        <Menu
          zIndex={150}
          opened={isMenuOpen}
          onChange={() => {
            if (timelineOpened) return;
            setMenuOpen(!isMenuOpen);
          }}>
          <Menu.Target>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <OrderTimelineModal
              closeMenu={() => setMenuOpen(false)}
              opened={timelineOpened}
              close={closeTimeline}
              open={openTimeline}
              id={id}
            />
          </Menu.Dropdown>
        </Menu>
      );
    },
  },
];
