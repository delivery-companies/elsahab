import { LoadingOverlay } from "@mantine/core";

import { DataTable } from "@/screens/Employees/data-table";
import { columns } from "./columns";
import { OrdersFilter } from "@/services/getOrders";
// import { tr } from "date-fns/locale";
// import { AddTransaction } from "./components/AddTransaction";

interface props {
  isLoading: boolean;
  data: any;
  filters: OrdersFilter;
  setFilters: React.Dispatch<React.SetStateAction<OrdersFilter>>;
}
export const RecevingTab = ({
  isLoading,
  data,
  filters,
  setFilters,
}: props) => {
  return (
    <div className="relative">
      <LoadingOverlay visible={isLoading} />
      <DataTable
        data={data?.data || []}
        columns={columns}
        filters={{
          ...filters,
          pagesCount: data?.pagesCount,
        }}
        setFilters={setFilters}
        showBk={true}
      />
    </div>
  );
};
