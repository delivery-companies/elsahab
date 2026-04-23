import { useChangeOrderStatus } from "@/hooks/useChangeOrderStatus";
import { useDeactivateOrder } from "@/hooks/useDeactivateOrder";
import { governorateArabicNames } from "@/lib/governorateArabicNames ";
import { orderStatusArabicNames } from "@/lib/orderStatusArabicNames";
import type { Order } from "@/services/getOrders";
import { useClientOrdersStore } from "@/store/confirmClientOrders";
import { ActionIcon, Badge, Checkbox, Flex, Text, rem } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
/* eslint-disable react-hooks/rules-of-hooks */
import type { ColumnDef } from "@tanstack/react-table";
import toast from "react-hot-toast";

export const columns: ColumnDef<Order>[] = [
    {
        id: "select",
        header: ({ table }) => {
            const { deleteAllClientOrders, setAllClientOrders, isClientOrderExist } = useClientOrdersStore();

            return (
                <Checkbox
                    checked={
                        table.getRowModel().rows.length > 0 &&
                        table
                            .getRowModel()
                            .rows.every((row) => isClientOrderExist(row.original.id.toString()))
                    }
                    onChange={(event) => {
                        const allTableRowsIds = table.getRowModel().rows.map((row) => ({
                            id: row.original.id.toString(),
                            name: row.original.recipientName
                        }));

                        const isAllSelected = event.currentTarget.checked;

                        if (isAllSelected) {
                            setAllClientOrders(allTableRowsIds);
                            table.toggleAllPageRowsSelected(true);
                        } else {
                            table.toggleAllPageRowsSelected(false);
                            deleteAllClientOrders();
                        }
                    }}
                />
            );
        },
        cell: ({ row }) => {
            const { addClientOrder, deleteClientOrder, isClientOrderExist } = useClientOrdersStore();
            return (
                <Checkbox
                    checked={isClientOrderExist(row.original.id.toString())}
                    onChange={(value) => {
                        const isChecked = value.currentTarget.checked;
                        const { id, recipientName } = row.original;
                        if (isChecked) {
                            addClientOrder({ id: id.toString(), name: recipientName });
                            row.toggleSelected(true);
                        } else {
                            row.toggleSelected(false);
                            deleteClientOrder(id.toString());
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
        accessorKey: "client.name",
        header: "العميل"
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
            const { recipientAddress, governorate, location } = row.original;
            return (
                <Text truncate maw={rem(100)} size="sm" style={{width:"150px",overflow:"visible",maxWidth:"unset",whiteSpace:"wrap"}}>
                    {governorateArabicNames[governorate]} {location?.name && `- ${location?.name}`}{" "}
                    {recipientAddress && `- ${recipientAddress}`}
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
            return formattedNumber;
        }
    },
    {
        accessorKey: "deliveryCost",
        header: "أجرة التوصيل"
    },
    {
        accessorKey: "paidAmount",
        header: "المبلغ المدفوع"
    },
    {
        accessorKey: "status",
        header: "الحالة",
        accessorFn: ({ status }) => {
            return orderStatusArabicNames[status];
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const { id } = row.original;
            const { mutate: confirmOrder, isLoading } = useChangeOrderStatus();
            const { mutate: deleteOrder, isLoading: isDeletingOrderLoading } = useDeactivateOrder();

            const handleConfirmOrder = () => {
                confirmOrder(
                    {
                        id,
                        data: {
                            confirmed: true,
                        }
                    },
                    {
                        onSuccess: () => {
                            toast.success("تم تأكيد الطلب بنجاح");
                        }
                    }
                );
            };

            const handleDeleteOrder = () => {
                deleteOrder(id, {
                    onSuccess: () => {
                        toast.success("تم اضافة الطلب الي قائمة المحذوفات بنجاح بنجاح");
                    }
                });
            };

            return (
                <div className="flex items-center gap-4">
                    <ActionIcon
                        variant="filled"
                        color="teal"
                        disabled={isLoading || isDeletingOrderLoading}
                        onClick={handleConfirmOrder}
                    >
                        <IconCheck />
                    </ActionIcon>
                    <ActionIcon
                        variant="filled"
                        disabled={isDeletingOrderLoading || isLoading}
                        onClick={handleDeleteOrder}
                    >
                        <IconX />
                    </ActionIcon>
                </div>
            );
        }
    }
];
