import { OrdersBadge } from "@/components/OrdersBadge";
import { useActivateOrder } from "@/hooks/useActivateOrder";
import { deliveryTypesArabicNames } from "@/lib/deliveryTypesArabicNames";
import { governorateArabicNames } from "@/lib/governorateArabicNames ";
import type { Order } from "@/services/getOrders";
import { useOrdersStore } from "@/store/ordersStore";
import { ActionIcon, Badge, Checkbox, Flex, Text, rem } from "@mantine/core";
import { IconRotate } from "@tabler/icons-react";
/* eslint-disable react-hooks/rules-of-hooks */
import type { ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { PermanentlyDeleteOrder } from "./PermanentlyDeleteOrder";

export const columns: ColumnDef<Order>[] = [
    {
        id: "select",
        header: ({ table }) => {
            const { deleteAllOrders, setAllOrders, isOrderExist } = useOrdersStore();
            return (
                <Checkbox
                    checked={
                        table.getRowModel().rows.length > 0 &&
                        table.getRowModel().rows.every((row) => isOrderExist(row.original.id.toString()))
                    }
                    onChange={(event) => {
                        const allTableRowsIds = table.getRowModel().rows.map((row) => ({
                            id: row.original.id.toString(),
                            name: row.original.recipientName
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
        }
    },
    {
        accessorKey: "id",
        header: "#"
    },
    {
        accessorKey: "receiptNumber",
        header: "رقم الوصل"
    },
    {
        accessorKey: "recipientName",
        header: "اسم المستلم"
    },
    {
        accessorKey: "recipientPhone",
        header: "رقم الهاتف",
        cell: ({ row }) => {
            const { recipientPhones } = row.original;
            return recipientPhones.length > 1 ? (
                <Flex gap="xs">
                    <Text size="sm">{recipientPhones[0]}</Text>
                    <Badge color="blue" variant="light">
                        {recipientPhones.length - 1}
                    </Badge>
                </Flex>
            ) : (
                <Text size="sm">لا يوجد</Text>
            );
        }
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
        }
    },
    {
        accessorKey: "totalCost",
        header: "المبلغ",
        cell: ({ row }) => {
            const { totalCost } = row.original;
            const formattedNumber = totalCost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return formattedNumber || "0";
        }
    },
    {
        accessorKey: "paidAmount",
        header: "المبلغ المدفوع"
    },
    {
        accessorKey: "companyNet",
        header: "صافي الشركة",
        cell: ({ row }) => {
            const { companyNet } = row.original;
            return (
                <Text dir={Number(companyNet) > 0 ? "rtl" : "ltr"} size="sm">
                    {companyNet}
                </Text>
            );
        }
    },
    {
        accessorKey: "clientNet",
        header: "صافي العميل",
        cell: ({ row }) => {
            const { clientNet } = row.original;
            return (
                <Text dir={Number(clientNet) > 0 ? "rtl" : "ltr"} size="sm">
                    {clientNet}
                </Text>
            );
        }
    },
    {
        accessorKey: "deliveryAgent.deliveryCost",
        header: "صافي المندوب",
        cell: ({ row }) => {
            if (!row.original.deliveryAgent) return <Text size="sm">لا يوجد</Text>;
            const { deliveryCost } = row.original.deliveryAgent;
            return deliveryCost;
        }
    },
    {
        accessorKey: "deliveryCost",
        header: "تكلفة التوصيل"
    },
    {
        accessorKey: "status",
        header: "الحالة",
        cell: ({ row }) => {
            const { status,secondaryStatus,repository } = row.original;
            return <OrdersBadge status={status} secondaryStatus={secondaryStatus}  repositoryname={repository?.name}/>;
        }
    },
    {
        accessorKey: "deliveryType",
        header: "نوع التوصيل",
        accessorFn: ({ deliveryType }) => {
            return deliveryTypesArabicNames[deliveryType];
        }
    },
    {
        accessorKey: "deletedAt",
        header: "تاريخ الحذف",
        accessorFn: ({ deletedAt }) => {
            if (deletedAt) {
                return format(parseISO(deletedAt), "yyyy-MM-dd");
            }
            return "";
        }
    },
    {
        accessorKey: "deletedBy.name",
        header: "من قبل"
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const { id } = row.original;

            const { mutate: activate } = useActivateOrder();

            const handleActivate = () => {
                activate(id);
            };

            return (
                <div className="flex justify-center gap-5">
                    <PermanentlyDeleteOrder id={id} />
                    <ActionIcon variant="filled" onClick={handleActivate} color="green" aria-label="Settings">
                        <IconRotate />
                    </ActionIcon>
                </div>
            );
        }
    }
];
