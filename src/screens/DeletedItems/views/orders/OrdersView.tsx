import { useOrders } from "@/hooks/useOrders";
import type { OrdersFilter, OrdersMetaData } from "@/services/getOrders";
import { LoadingOverlay } from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import { useState } from "react";
import { CustomDeletedOrdersFilter } from "./CustomDeletedOrdersFilter";
import { OrdersTable } from "./OrdersTable";
import { columns } from "./columns";

export const ordersFilterInitialState: OrdersFilter = {
    page: 1,
    size: 10,
    client_id: "",
    delivery_agent_id: "",
    delivery_date: null,
    delivery_type: "",
    end_date: "",
    governorate: "",
    location_id: "",
    pagesCount: 0,
    product_id: "",
    receipt_number: "",
    recipient_address: "",
    recipient_name: "",
    recipient_phone: "",
    search: "",
    sort: "",
    start_date: "",
    status: "",
    store_id: "",
    deleted: true,
    statuses: [],
    from: "DELETED",
    forwarded: false,
    forwarded_by_id: undefined,
    forwarded_from_id: undefined
};

export const DeletedOrdersView = () => {
    const [ordersFilters, setOrdersFilters] = useState<OrdersFilter>({
        ...ordersFilterInitialState,
        branch_report: undefined,
        client_report: undefined,
        company_report: undefined,
        delivery_agent_report: undefined,
        governorate_report: undefined,
        repository_report: undefined
    });
    const [search, setSearch] = useDebouncedState("", 300);

    const {
        data: orders = {
            data: {
                orders: [],
                ordersMetaData: {} as OrdersMetaData
            },
            pagesCount: 0
        },
        isInitialLoading
    } = useOrders({
        ...ordersFilters,
        search
    });

    return (
        <>
            <CustomDeletedOrdersFilter
                filters={ordersFilters}
                search={search}
                setFilters={setOrdersFilters}
                setSearch={setSearch}
            />
            <div className="relative mt-12">
                <LoadingOverlay visible={isInitialLoading} />
                <OrdersTable
                    columns={columns}
                    data={orders.data.orders}
                    setFilters={setOrdersFilters}
                    filters={{
                        ...ordersFilters,
                        pagesCount: orders.pagesCount
                    }}
                />
            </div>
        </>
    );
};
