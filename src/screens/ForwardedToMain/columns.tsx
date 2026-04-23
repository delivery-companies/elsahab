import { governorateArabicNames } from "@/lib/governorateArabicNames ";
import { orderStatusArabicNames } from "@/lib/orderStatusArabicNames";
import type { Order } from "@/services/getOrders";
import { Flex, Text, rem } from "@mantine/core";
/* eslint-disable react-hooks/rules-of-hooks */
import type { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Order>[] = [
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
          }}
        >
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
          }}
        >
          {client.company}
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
];
