import { OrdersBadge } from "@/components/OrdersBadge";
// import { useEditOrder } from "@/hooks/useEditOrder";
import { governorateArabicNames } from "@/lib/governorateArabicNames ";
import type { Order } from "@/services/getOrders";
import { useOrdersForwardedToCompany } from "@/store/ordersForwardedToCompany";
import { ActionIcon, Badge, Checkbox, Flex, Text, rem } from "@mantine/core";
import { IconRotate } from "@tabler/icons-react";
// import { IconRotate } from "@tabler/icons-react";
/* eslint-disable react-hooks/rules-of-hooks */
import type { ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
// import toast from "react-hot-toast";
import Arabic from "date-fns/locale/ar-EG";
import { useMutation } from "@tanstack/react-query";
import {
  EditOrderPayload,
  saveOrderInRepositoryService,
} from "@/services/editOrder";
import { queryClient } from "@/main";
import { useAuth } from "@/store/authStore";

export const columns: ColumnDef<Order>[] = [
  {
    id: "select",
    header: ({ table }) => {
      const { deleteAllOrders, setAllOrders, isOrderExist } =
        useOrdersForwardedToCompany();

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
      const { addOrder, deleteOrder, isOrderExist } =
        useOrdersForwardedToCompany();
      return (
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
    accessorKey: "recipientName",
    header: "اسم المستلم",
  },
  {
    accessorKey: "forwardedBy.name",
    header: "قام بتحويلها",
    cell: ({ row }) => {
      const { forwardedBy } = row.original;
      return <Text size="sm">{forwardedBy?.name || ""}</Text>;
    },
  },
  {
    accessorKey: "client.name",
    header: "العميل",
  },
  {
    accessorKey: "recipientPhone",
    header: "رقم الهاتف",
    cell: ({ row }) => {
      const { recipientPhones } = row.original;
      let phoneElement;
      switch (recipientPhones.length) {
        case 0:
          phoneElement = <Text size="sm">لا يوجد</Text>;
          break;
        case 1:
          phoneElement = <Text size="sm">{recipientPhones[0]}</Text>;
          break;
        default:
          phoneElement = (
            <Flex gap="xs">
              <Text size="sm">{recipientPhones[0]}</Text>
              <Badge color="blue" variant="light">
                {recipientPhones.length - 1}
              </Badge>
            </Flex>
          );
          break;
      }

      return phoneElement;
    },
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
    accessorKey: "totalCost",
    header: "المبلغ",
    cell: ({ row }) => {
      const { totalCost } = row.original;
      const formattedNumber = totalCost
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return formattedNumber;
    },
  },
  {
    accessorKey: "deliveryCost",
    header: "تكلفة التوصيل",
  },
  {
    accessorKey: "status",
    header: "الحالة",
    cell: ({ row }) => {
      const { status, secondaryStatus, repository, company } = row.original;
      return (
        <OrdersBadge
          status={status}
          secondaryStatus={secondaryStatus}
          repositoryname={repository?.name}
          company={company.name}
        />
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "تاريخ التحويل",
    accessorFn: ({ forwardedAt }) => {
      const stringToDate = parseISO(forwardedAt!!);
      const formattedDate = format(stringToDate, "dd/MM/yyyy HH:mm a", {
        locale: Arabic,
      });
      return formattedDate;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original;
      const { mainRepository } = useAuth();

      const { mutate: editOrder, isLoading: saveLoading } = useMutation({
        mutationFn: (data: { data: EditOrderPayload; id: string }) => {
          return saveOrderInRepositoryService({
            id: data.id,
            data: data.data,
          });
        },
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["orders"],
          });
          queryClient.invalidateQueries({
            queryKey: ["timeline"],
          });
        },
      });

      const handleReturnOrder = () => {
        if (mainRepository) {
          editOrder({
            data: {
              secondaryStatus: "IN_REPOSITORY",
              status: "IN_MAIN_REPOSITORY",
            },
            id: id,
          });
        } else {
          editOrder({
            data: {
              secondaryStatus: "IN_REPOSITORY",
              status: "IN_GOV_REPOSITORY",
            },
            id: id,
          });
        }
      };

      return (
        <div className="flex justify-center gap-5">
          <ActionIcon
            disabled={saveLoading}
            variant="filled"
            onClick={handleReturnOrder}
            color="teal"
            aria-label="delete order">
            <IconRotate />
          </ActionIcon>
        </div>
      );
    },
  },
];
