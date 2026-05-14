import { AppLayout } from "@/components/AppLayout";
import { useReports } from "@/hooks/useReports";
import type { ReportsFilters } from "@/services/getReports";
import { useAuth } from "@/store/authStore";
import { Paper, Tabs } from "@mantine/core";
import { useState } from "react";
import { BranchReportsView } from "./components/TabsViews/BranchReportsView";
import { ClientReportsView } from "./components/TabsViews/ClientReportsView";
import { CompanyReportsView } from "./components/TabsViews/CompanyReportsView";
import { DeliveryAgentReportsView } from "./components/TabsViews/DeliveryAgentReportsView";
import { GovernorateReportsView } from "./components/TabsViews/GovernorateReportsView";
import { RepositoryReportsView } from "./components/TabsViews/RepositoryReportsView";

type ReportsTabsTypes =
  | "COMPANY"
  | "REPOSITORY"
  | "GOVERNORATE"
  | "DELIVERY_AGENT"
  | "BRANCH"
  | "CLIENT";

export const reportsFilterInitialState: ReportsFilters = {
  page: 1,
  size: 10,
  client_id: "",
  delivery_agent_id: "",
  end_date: "",
  governorate: "",
  pagesCount: 0,
  sort: "",
  start_date: "",
  status: "",
  store_id: "",
  created_by_id: "",
};

export const ReportsScreen = () => {
  const { role, mainRepository } = useAuth();
  const [activeTab, setActiveTab] = useState<ReportsTabsTypes>("CLIENT");

  const { isError, isInitialLoading } = useReports();

  return (
    <AppLayout isLoading={isInitialLoading} isError={isError}>
      <Tabs
        keepMounted={false}
        variant="pills"
        radius="md"
        defaultValue="COMPANY"
        value={activeTab}
        onChange={(e) => {
          if (e) {
            setActiveTab(e as ReportsTabsTypes);
          }
        }}>
        <Paper className="mb-6 py-2 rounded px-3" withBorder>
          <Tabs.List grow>
            <Tabs.Tab value="CLIENT">عميل</Tabs.Tab>
            {role !== "CLIENT" && (
              <>
                {mainRepository || role === "COMPANY_MANAGER" ? (
                  <>
                    <Tabs.Tab value="COMPANY">شركة</Tabs.Tab>
                    <Tabs.Tab value="GOVERNORATE">محافظة</Tabs.Tab>
                    <Tabs.Tab value="BRANCH">فرع</Tabs.Tab>
                  </>
                ) : null}
                <Tabs.Tab value="REPOSITORY">مخزن</Tabs.Tab>
                <Tabs.Tab value="DELIVERY_AGENT">مندوب</Tabs.Tab>
              </>
            )}
          </Tabs.List>
        </Paper>
        {mainRepository || role === "COMPANY_MANAGER" ? (
          <>
            <Tabs.Panel value="COMPANY">
              <CompanyReportsView />
            </Tabs.Panel>
            <Tabs.Panel value="GOVERNORATE">
              <GovernorateReportsView />
            </Tabs.Panel>
            <Tabs.Panel value="BRANCH">
              <BranchReportsView />
            </Tabs.Panel>
          </>
        ) : null}
        <Tabs.Panel value="REPOSITORY">
          <RepositoryReportsView />
        </Tabs.Panel>
        <Tabs.Panel value="CLIENT">
          <ClientReportsView />
        </Tabs.Panel>
        <Tabs.Panel value="DELIVERY_AGENT">
          <DeliveryAgentReportsView />
        </Tabs.Panel>
      </Tabs>
    </AppLayout>
  );
};
