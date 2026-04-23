import { useTenants } from "@/hooks/useTenants";
import { getSelectOptions } from "@/lib/getSelectOptions";
import type { APIError } from "@/models";
import { type EditOrderPayload, editOrderService } from "@/services/editOrder";
import { useOrdersStore } from "@/store/ordersStore";
import { Button, Modal, Select } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

export const ForwardOrdersToCompany = () => {
    const queryClient = useQueryClient();
    const { orders: selectedOrders, deleteAllOrders } = useOrdersStore();
    const [opened, { open, close }] = useDisclosure(false);
    const { data: tenantsData } = useTenants({
        size: 100000,
        minified: true
    });
    const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

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
            setSelectedCompany(null);
        },
        onError: (error: AxiosError<APIError>) => {
            toast.error(error.response?.data.message || "حدث خطأ ما");
        }
    });

    const handleSubmit = () => {
        if (selectedCompany) {
            selectedOrders.forEach((order) => {
                editOrder({
                    id: order.id,
                    data: {
                        forwardedCompanyID: Number(selectedCompany)
                    }
                });
            });
            toast.success("تم اسناد الطلب بنجاح");
        }
    };

    return (
        <>
            <Modal title="اسناد الطلب" opened={opened} onClose={close} centered>
                <Select
                    value={selectedCompany}
                    allowDeselect
                    label="الشركات"
                    searchable
                    clearable
                    onChange={(e) => {
                        setSelectedCompany(e);
                    }}
                    placeholder="اختر الشركة"
                    data={getSelectOptions(tenantsData?.data || [])}
                    limit={100}
                />
                <div className="flex justify-between mt-4 gap-6">
                    <Button
                        loading={false}
                        disabled={!selectedCompany || isLoading}
                        fullWidth
                        onClick={handleSubmit}
                        type="submit"
                    >
                        اسناد
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
                اسناد الطلب
            </Button>
        </>
    );
};
