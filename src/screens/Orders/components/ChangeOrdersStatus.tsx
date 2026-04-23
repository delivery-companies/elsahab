import { type orderStatusArabicNames, orderStatusArray } from "@/lib/orderStatusArabicNames";
import type { APIError } from "@/models";
import { type EditOrderPayload, editOrderService } from "@/services/editOrder";
import { useAuth } from "@/store/authStore";
import { useOrdersStore } from "@/store/ordersStore";
import { Button, Modal, Select } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type OrderStatusItem = {
    label: string;
    value: string;
};

export const ChangeOrdersStatus = () => {
    const queryClient = useQueryClient();
    const { orders: selectedOrders, deleteAllOrders } = useOrdersStore();
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedBranch, setSelectedBranch] = useState<keyof typeof orderStatusArabicNames | null>(null);

    const{orderStatus:userOrderStatus}=useAuth()
    const [allowedOrderStatus, setAllowedStatus] = useState<OrderStatusItem[]>([]);


    useEffect(() => {
        let newStatuses: OrderStatusItem[] = [];
        if (userOrderStatus) {
            userOrderStatus.forEach(e => {
                const found = orderStatusArray.find(status => status.value === e);
                if (found) newStatuses.push(found);
            });
        }
        setAllowedStatus(newStatuses);
    }, []);

    const { mutate: editOrder, isLoading } = useMutation({
        mutationFn: ({ data, id }: { id: string; data: EditOrderPayload }) =>
            editOrderService({
                id,
                data
            }),
        onSuccess: () => {
            close();
            queryClient.invalidateQueries({
                queryKey: ["orders"]
            });
            queryClient.invalidateQueries({
                queryKey: ["timeline"]
            });
            deleteAllOrders();
            setSelectedBranch(null);
        },
        onError: (error: AxiosError<APIError>) => {
            toast.error(error.response?.data.message || "حدث خطأ ما");
        }
    });

    const handleSubmit = () => {
        if (selectedBranch) {
            selectedOrders.forEach((order) => {
                editOrder({
                    id: order.id,
                    data: {
                        status: selectedBranch
                    }
                });
            });
            toast.success("تم تعديل الحالة بنجاح");
        }
    };

    return (
        <>
            <Modal title="تغيير  الحالة" opened={opened} onClose={close} centered>
                <Select
                    value={selectedBranch}
                    allowDeselect
                    label="الحالة"
                    searchable
                    clearable
                    onChange={(e) => {
                        setSelectedBranch(e as keyof typeof orderStatusArabicNames);
                    }}
                    placeholder="اختر الحالة"
                    data={allowedOrderStatus}
                    limit={100}
                />
                <div className="flex justify-between mt-4 gap-6">
                    <Button
                        loading={false}
                        disabled={!selectedBranch || isLoading}
                        fullWidth
                        onClick={handleSubmit}
                        type="submit"
                    >
                        تعديل
                    </Button>

                    <Button
                        onClick={() => {
                            close();
                        }}
                        fullWidth
                        variant="outline"
                    >
                        الغاء
                    </Button>
                </div>
            </Modal>

            <Button  style={{flexGrow:"1"}} disabled={!selectedOrders.length} onClick={open}>
                تغير الحالة
            </Button>
        </>
    );
};
