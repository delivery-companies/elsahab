import { useClients } from "@/hooks/useClients";
import { useEmployees } from "@/hooks/useEmployees";
import { getSelectOptions } from "@/lib/getSelectOptions";
import { OrdersFilter } from "@/services/getOrders";
import { Accordion, Grid, Select } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { format, parseISO } from "date-fns";
import "dayjs/locale/ar";

interface IReportsFilter {
  filters: OrdersFilter;
  setFilters: React.Dispatch<React.SetStateAction<OrdersFilter>>;
}

export const TreasuryFilters = ({ filters, setFilters }: IReportsFilter) => {
  const {
    data: reportCreatedBy = {
      data: [],
    },
  } = useEmployees({
    size: 100000,
    minified: true,
    roles: ["DELIVERY_AGENT"],
  });

  const {
    data: receivingAgents = {
      data: [],
    },
  } = useEmployees({
    size: 100000,
    minified: true,
    roles: ["RECEIVING_AGENT"],
  });

  const {
    data: clientsData = {
      data: [],
    },
  } = useClients({ size: 100000, minified: true });

  const convertDateFormat = (date: Date | null): string | null => {
    if (date) {
      const parsedDate = parseISO(date.toISOString());
      return format(parsedDate, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
    }
    return null;
  };

  return (
    <Accordion variant="separated">
      <Accordion.Item className="rounded-md mb-8" value="reports-filter">
        <Accordion.Control>فلتر</Accordion.Control>
        <Accordion.Panel>
          <Grid align="center" gutter="lg" grow>
            <Grid.Col span={{ base: 12, md: 4, lg: 3, sm: 12, xs: 12 }}>
              <Select
                value={filters.delivery_agent_id}
                allowDeselect
                label="المندوب"
                searchable
                clearable
                onChange={(e) => {
                  setFilters({
                    ...filters,
                    delivery_agent_id: e || "",
                  });
                }}
                placeholder="اختر المندوب"
                data={getSelectOptions(reportCreatedBy.data)}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4, lg: 3, sm: 12, xs: 12 }}>
              <Select
                value={filters.type}
                allowDeselect
                label="نوع البريد"
                searchable
                clearable
                onChange={(e) => {
                  setFilters({
                    ...filters,
                    type: e || "",
                  });
                }}
                placeholder="اختر نوع المعامله"
                data={[
                  { value: "forwardedAll", label: "البريد الصادر" },
                  { value: "receivedAll", label: "البريد الوارد" },
                  { value: "inside", label: "البريد الداخلي" },
                ]}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 3, sm: 12, xs: 12 }}>
              <Select
                value={filters.client_id || null}
                allowDeselect
                label="العملاء"
                searchable
                clearable
                onChange={(e) => {
                  setFilters({
                    ...filters,
                    client_id: e || "",
                  });
                }}
                placeholder="اختر العميل"
                data={getSelectOptions(clientsData.data)}
                limit={100}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 4, md: 4, lg: 3, sm: 12, xs: 12 }}>
              <Select
                value={filters.repository_id}
                allowDeselect
                label="مندوب الاستلام"
                searchable
                clearable
                onChange={(e) => {
                  setFilters({
                    ...filters,
                    repository_id: e || "",
                  });
                }}
                placeholder="اختر المندوب"
                data={getSelectOptions(receivingAgents.data)}
              />
            </Grid.Col>
            <Grid.Col
              span={{
                base: 12,
                md: 4,
                lg: 3,
                sm: 12,
                xs: 12,
              }}>
              <DatePickerInput
                valueFormat="DD MMM YYYY"
                label="بداية تاريخ الطلب"
                value={filters.start_date ? new Date(filters.start_date) : null}
                placeholder="اختر تاريخ البداية"
                locale="ar"
                clearable
                onChange={(date) => {
                  const formattedDate = convertDateFormat(date);
                  setFilters({
                    ...filters,
                    start_date: formattedDate,
                  });
                }}
              />
            </Grid.Col>
            <Grid.Col
              span={{
                base: 12,
                md: 4,
                lg: 3,
                sm: 12,
                xs: 12,
              }}>
              <DatePickerInput
                valueFormat="DD MMM YYYY"
                label="نهاية تاريخ الطلب"
                placeholder="اختر تاريخ النهاية"
                value={filters.end_date ? new Date(filters.end_date) : null}
                locale="ar"
                clearable
                onChange={(date) => {
                  const formattedDate = convertDateFormat(date);
                  setFilters({
                    ...filters,
                    end_date: formattedDate,
                  });
                }}
              />
            </Grid.Col>
          </Grid>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};
