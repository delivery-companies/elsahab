import { OrdersBadge } from "@/components/OrdersBadge";
import { useDeactivateOrder } from "@/hooks/useDeactivateOrder";
import { useEditOrder } from "@/hooks/useEditOrder";
import { governorateArabicNames } from "@/lib/governorateArabicNames ";
import type { Order } from "@/services/getOrders";
import { useForwardedOrdersStore } from "@/store/forwardedOrders";
import { ActionIcon, Badge, Checkbox, Flex, Text, rem } from "@mantine/core";
import { IconCheck, IconTrash } from "@tabler/icons-react";
/* eslint-disable react-hooks/rules-of-hooks */
import type { ColumnDef } from "@tanstack/react-table";
import toast from "react-hot-toast";

export const columns: ColumnDef<Order>[] = [
    {
        id: "select",
        header: ({ table }) => {
            const { deleteAllOrders, setAllOrders, isOrderExist } = useForwardedOrdersStore();

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
            const { addOrder, deleteOrder, isOrderExist } = useForwardedOrdersStore();
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
        accessorKey: "forwardedBy.name",
        header: "قام باضافتها",
        cell: ({ row }) => {
            const { forwardedBy } = row.original;
            return <Text size="sm">{forwardedBy?.name || ""}</Text>;
        }
    },
    {
        accessorKey: "client.name",
        header: "العميل",
        cell:({row})=>{
            const {client,store}=row.original
            return <Text truncate maw={rem(100)} size="sm" style={{width:"150px",overflow:"visible",maxWidth:"unset",whiteSpace:"wrap",fontSize:"12px",fontWeight:"bold"}}>
                   { client.name + " | "+store.name}
                </Text>
        }
    },
    {
        accessorKey: "client.company",
        header: "شركه العميل",
        cell:({row})=>{
            const {client}=row.original
            return <Text truncate maw={rem(100)} size="sm" style={{width:"150px",overflow:"visible",maxWidth:"unset",whiteSpace:"wrap",fontSize:"12px",fontWeight:"bold"}}>
                   { client.company}
                </Text>
        }
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
            return formattedNumber;
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
        id: "actions",
        cell: ({ row }) => {
            const { id } = row.original;

            const { mutate: deleteOrder, isLoading: isDeleteLoading } = useDeactivateOrder();

            const { mutate: editOrderStatus, isLoading: isEditingOrderLoading } = useEditOrder();

            const handleDeleteOrder = () => {
                deleteOrder(id, {
                    onSuccess: () => {
                        toast.success("تم حذف الطلب بنجاح");
                    }
                });
            };

            const handleApproveOrder = () => {
                editOrderStatus({
                    id,
                    data: {
                        confirmed: true
                    }
                });
            };

            if(row.original.confirmed){
                return "تم التاكيد"
            }
            
            return (
                <div className="flex justify-center gap-5">
                    <ActionIcon
                        disabled={isEditingOrderLoading}
                        variant="filled"
                        onClick={handleApproveOrder}
                        color="green"
                        aria-label="Settings"
                    >
                        <IconCheck />
                    </ActionIcon>
                    <ActionIcon
                        disabled={isDeleteLoading}
                        variant="filled"
                        onClick={handleDeleteOrder}
                        color="red"
                        aria-label="delete order"
                    >
                        <IconTrash />
                    </ActionIcon>
                </div>
            );
        }
    }
];
