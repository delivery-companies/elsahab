import { AppLayout } from "@/components/AppLayout";
import { Grid, Loader, Paper, Tabs } from "@mantine/core";
import { useState } from "react";
import { TreasuryCard } from "./components/TreasuryCard";
import { TreasuryFilters } from "./components/TreasuryFilters";
import {
  useRecevingAgentClients,
  useTransactions,
  useTransactionsStatistics,
} from "@/hooks/useTransactions";
import { TransactionTab } from "./Taps/TransactionsTab";
import { OrdersFilter } from "@/services/getOrders";
import { RecevingTab } from "./Taps/ReceivingAgentTab";

type ReportsTabsTypes = "TRANSACTIONS" | "RECEING_AGENT";

export const TreasuryScreen = () => {
  const [filters, setFilters] = useState<OrdersFilter>({
    page: 1,
    size: 10,
  });

  const [activeTab, setActiveTab] = useState<ReportsTabsTypes>("TRANSACTIONS");

  const { data, isLoading, isError } = useTransactions({
    ...filters,
  });

  const {
    data: statistics,
    isLoading: isLoadingStatistics,
    isError: isErrorStatistics,
  } = useTransactionsStatistics({
    ...filters,
  });

  const { data: clients, isFetching } = useRecevingAgentClients(
    {
      ...filters,
    },
    !!filters.repository_id,
  );

  return (
    <AppLayout isError={isError || isErrorStatistics}>
      <TreasuryFilters filters={filters} setFilters={setFilters} />
      {isLoadingStatistics && (
        <div className="w-full flex justify-center items-center">
          <Loader />
        </div>
      )}
      <Grid>
        <TreasuryCard
          title="القاصه"
          value={statistics?.total || 0}
          isLoading={isLoadingStatistics}
          color="green"
        />
        <TreasuryCard
          title="ما تم ايداعه في القاصه"
          value={statistics?.totalDepoist || 0}
          isLoading={isLoadingStatistics}
          color="blue"
        />
        <TreasuryCard
          title="ما تم سحبه من القاصه"
          value={statistics?.totalWithdraw || 0}
          isLoading={isLoadingStatistics}
          color="red"
        />
        <TreasuryCard
          title="ما تم استلامه من المناديب بعد خصم اجر المندوب"
          value={statistics?.receivedFromAgents || 0}
          isLoading={isLoadingStatistics}
          color="orange"
        />
        <TreasuryCard
          title="فلوس مع المناديب"
          value={statistics?.notReceived || 0}
          isLoading={isLoadingStatistics}
          color="violet"
        />
        <TreasuryCard
          title="ما تم دفعه للعملاء"
          value={statistics?.paidToClients || 0}
          isLoading={isLoadingStatistics}
          color="yellow"
        />
        <TreasuryCard
          title="مبالغ مستحقه لعملاء"
          value={statistics?.forClients || 0}
          isLoading={isLoadingStatistics}
          color="teal"
        />
        <TreasuryCard
          title="أرباح المناديب"
          value={statistics?.agentProfit || 0}
          isLoading={isLoadingStatistics}
          color="teal"
        />
        <TreasuryCard
          title="أرباح الفرع"
          value={statistics?.branchProfit || 0}
          isLoading={isLoadingStatistics}
          color="green"
        />
      </Grid>
      <Tabs
        keepMounted={false}
        className="mt-5"
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
            <Tabs.Tab value="TRANSACTIONS">العمليات داخل القاصه</Tabs.Tab>
            <Tabs.Tab value="RECEING_AGENT">ارباح مندوب الاستلام</Tabs.Tab>
          </Tabs.List>
        </Paper>

        <Tabs.Panel value="TRANSACTIONS">
          <TransactionTab
            isLoading={isLoading}
            data={data}
            filters={filters}
            setFilters={setFilters}
          />
        </Tabs.Panel>
        <Tabs.Panel value="RECEING_AGENT">
          <RecevingTab
            isLoading={isFetching}
            data={clients}
            filters={filters}
            setFilters={setFilters}
          />
        </Tabs.Panel>
      </Tabs>
    </AppLayout>
  );
};
