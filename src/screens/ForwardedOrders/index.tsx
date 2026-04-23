import { AppLayout } from "@/components/AppLayout";
import { useOrders } from "@/hooks/useOrders";
import type { OrdersFilter } from "@/services/getOrders";
import { LoadingOverlay } from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import { useState } from "react";
// import { ordersFilterInitialState } from "../Orders";
import { OrdersTable } from "../Orders/components/OrdersTable";
import { ForwardedOrdersFilters } from "./ForwardedOrdersFilters";
import { columns } from "./columns";

// NEW PAGE IN THE COMMENT BELOW
// from our company to other company forwarded:true, forwarded_from_id from the useAuth companyID
export const ForwardedOrders = () => {
    // from other company to our company
    const [filters, setFilters] = useState<OrdersFilter>({
        page:1,
        size:10,
        deleted:false,
        forwarded: true,
        confirmed:false
    });

    const [search, setSearch] = useDebouncedState("", 300);

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

    return (
        <AppLayout isError={isError}>
            <ForwardedOrdersFilters
                filters={filters}
                search={search}
                setFilters={setFilters}
                setSearch={setSearch}
            />
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
