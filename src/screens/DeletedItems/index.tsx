import { AppLayout } from "@/components/AppLayout";
import { Paper, Tabs } from "@mantine/core";

import { useOrders } from "@/hooks/useOrders";
import { useState } from "react";
import { DeletedClientsView } from "./views/Clients";
import { DeletedEmployees } from "./views/Employees";
import { DeletedReportsView } from "./views/Reports";
import { DeletedStoresView } from "./views/Stores/StoreView";
import { DeletedOrdersView } from "./views/orders/OrdersView";

type TabsTypes = "ORDERS" | "REPORTS" | "CLIENTS" | "STORES" | "EMPLOYEES";

export const DeletedScreen = () => {
    const { isInitialLoading, isError } = useOrders();
    const [activeTab, setActiveTab] = useState<TabsTypes>("ORDERS");

    return (
        <AppLayout isLoading={isInitialLoading} isError={isError}>
            <Tabs
                keepMounted={false}
                variant="pills"
                radius="md"
                defaultValue="STORES"
                value={activeTab}
                onChange={(e: string | null) => {
                    if (e) {
                        setActiveTab(e as TabsTypes);
                    }
                }}
            >
                <Paper className="mb-6 py-2 rounded px-3" withBorder>
                    <Tabs.List grow>
                        <Tabs.Tab value="ORDERS">الطلبات المحذوفة</Tabs.Tab>
                        <Tabs.Tab value="STORES">
                            <div>المتاجر المحذوفة</div>
                        </Tabs.Tab>
                        <Tabs.Tab value="REPORTS">
                            <div>الكشوفات المحذوفة</div>
                        </Tabs.Tab>
                        <Tabs.Tab value="CLIENTS">
                            <div>العملاء المحذوفين</div>
                        </Tabs.Tab>
                        <Tabs.Tab value="EMPLOYEES">
                            <div>الموظفين المحذوفين</div>
                        </Tabs.Tab>
                    </Tabs.List>
                </Paper>
                <Tabs.Panel value="ORDERS">
                    <DeletedOrdersView />
                </Tabs.Panel>
                <Tabs.Panel value="STORES">
                    <DeletedStoresView />
                </Tabs.Panel>
                <Tabs.Panel value="REPORTS">
                    <DeletedReportsView />
                </Tabs.Panel>
                <Tabs.Panel value="CLIENTS">
                    <DeletedClientsView />
                </Tabs.Panel>
                <Tabs.Panel value="EMPLOYEES">
                    <DeletedEmployees />
                </Tabs.Panel>
            </Tabs>
        </AppLayout>
    );
};
