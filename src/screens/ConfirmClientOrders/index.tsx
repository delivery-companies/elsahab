import { AppLayout } from "@/components/AppLayout";
import { useChangeOrderStatus } from "@/hooks/useChangeOrderStatus";
import { useOrderDetailsAction } from "@/hooks/useOrderDetailsAction";
import { useOrders } from "@/hooks/useOrders";
import type { OrdersFilter } from "@/services/getOrders";
import { Button, LoadingOverlay, TextInput,Switch } from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import { useState } from "react";
import toast from "react-hot-toast";
import { ordersFilterInitialState } from "../Orders";
import { OrdersTable } from "../Orders/components/OrdersTable";
import { columns } from "./columns";
import { ClientOrdersActions } from "./components/ClientOrdersActions";
import { ClientOrdersFilters } from "./components/ClientOrdersFilters";

import { lineSpinner } from 'ldrs'


// Default values shown

export const ConfirmClientOrders = () => {
    const [receiptNumber, setReceiptNumber] = useState("");
    const [autoConfirm, setAutoConfirm] = useState(false);
    const [filters, setFilters] = useState<OrdersFilter>({
        ...ordersFilterInitialState,
        confirmed: false
    });
    const [search, setSearch] = useDebouncedState("", 300);
    
    lineSpinner.register()

    const {
        data: orders = {
            data: {
                orders: []
            },
            pagesCount: 0
        },
        isError,
        isInitialLoading
    } = useOrders({
        ...filters,
        search
    });

    const { mutate: changeOrderConfirmedStatus, isLoading } = useChangeOrderStatus();

    const {
        mutate: getOrderDetails,
        reset: resetOrderDetails,
        isLoading: isGettingOrderDetailsLoading
    } = useOrderDetailsAction();

    const confirm=(receiptNumber:string)=>{
        getOrderDetails(receiptNumber, {
            onSuccess: ({ data }) => {
                if (!data) {
                    toast.error("الطلب غير موجود");
                    setReceiptNumber("");
                    resetOrderDetails();
                    return;
                }

                if (data.confirmed) {
                    toast.error("الطلب مؤكد مسبقاً");
                    setReceiptNumber("");
                    resetOrderDetails();
                    return;
                }
                changeOrderConfirmedStatus(
                    {
                        id: data.id,
                        data: {
                            confirmed: true,
                            status:"REGISTERED"
                        }
                    },
                    {
                        onSuccess: () => {
                            setReceiptNumber("");
                            toast.success("تم تأكيد الطلب بنجاح.");
                            resetOrderDetails();
                        },
                        onError: () => {
                            toast.error("حدث خطأ أثناء تأكيد الوصل");
                            resetOrderDetails();
                        }
                    }
                );
            }
        });
    }

    const handleChangeOrderStatus = () => {
        if (receiptNumber.length === 0) {
            toast.error("أدخل رقم الوصل");
            return;
        }
        confirm(receiptNumber)
    };

    const handleAutoChangeOrderStatus = (autoReceiptNumber:string) => {
        if (autoReceiptNumber.length === 0) {
            toast.error("أدخل رقم الوصل");
            return;
        }
        confirm(autoReceiptNumber)
    };

    return (
        <AppLayout isError={isError}>
            <ClientOrdersActions />
            <ClientOrdersFilters
                filters={filters}
                search={search}
                setFilters={setFilters}
                setSearch={setSearch}
            />
            <div className="items-center" style={{marginBottom:"20px"}}>
                <Switch
                    defaultChecked={false}
                    onChange={(event)=>setAutoConfirm(event.currentTarget.checked)}
                    label="تأكيد مباشر"
                />
            </div>
            <div className="flex gap-4 items-center" style={{alignItems:"end"}}>
                <TextInput
                    placeholder="أدخل رقم الوصل"
                    value={receiptNumber}
                    className="w-1/4"
                    onChange={(event) => {
                        setReceiptNumber(event.currentTarget.value)
                        if(autoConfirm){
                            handleAutoChangeOrderStatus(event.currentTarget.value)
                        }
                    }}
                    label="تأكيد مباشر برقم الوصل"
                    type="number"
                />
                {
                    !autoConfirm && (<Button
                        className="mt-6"
                        disabled={isLoading || isGettingOrderDetailsLoading}
                        onClick={handleChangeOrderStatus}
                    >
                        تأكيد
                    </Button>
                    )
                }
                {
                    isLoading || isGettingOrderDetailsLoading ? 
                    <l-line-spinner
                        size="30"
                        stroke="3"
                        speed="1" 
                        color="#e72722" 
                    ></l-line-spinner> : null
                }
                
            </div>
            <div className="relative mt-12">
                <LoadingOverlay visible={isInitialLoading} />
                <OrdersTable
                    columns={columns}
                    data={orders.data.orders}
                    setFilters={setFilters}
                    filters={{
                        ...filters,
                        pagesCount: orders.pagesCount
                    }}
                />
            </div>
        </AppLayout>
    );
};
