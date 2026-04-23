import { useEmployees } from "@/hooks/useEmployees";
import { getSelectOptions } from "@/lib/getSelectOptions";
import type { ReportsFilters as IReportsFilters } from "@/services/getReports";
import { Accordion, Grid, Select } from "@mantine/core";
import "dayjs/locale/ar";

interface IReportsFilter {
  filters: IReportsFilters;
  setFilters: React.Dispatch<React.SetStateAction<IReportsFilters>>;
}

export const TreasuryFilters = ({ filters, setFilters }: IReportsFilter) => {
  const {
    data: reportCreatedBy = {
      data: [],
    },
  } = useEmployees({
    size: 100000,
    minified: true,
    roles: [
      "ACCOUNTANT",
      "ACCOUNT_MANAGER",
      "BRANCH_MANAGER",
      "COMPANY_MANAGER",
      "DATA_ENTRY",
      "EMERGENCY_EMPLOYEE",
      "INQUIRY_EMPLOYEE",
      "RECEIVING_AGENT",
      "REPOSITORIY_EMPLOYEE",
    ],
  });

  return (
    <Accordion variant="separated">
      <Accordion.Item className="rounded-md mb-8" value="reports-filter">
        <Accordion.Control>فلاتر المعاملات</Accordion.Control>
        <Accordion.Panel>
          <Grid align="center" gutter="lg" grow>
            <Grid.Col span={{ base: 12, md: 4, lg: 4, sm: 12, xs: 12 }}>
              <Select
                value={filters.type}
                allowDeselect
                label="ناشئ المعامله"
                searchable
                clearable
                onChange={(e) => {
                  setFilters({
                    ...filters,
                    created_by_id: e || "",
                  });
                }}
                placeholder="اختر ناشئ المعامله"
                data={getSelectOptions(reportCreatedBy.data)}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4, lg: 4, sm: 12, xs: 12 }}>
              <Select
                value={filters.type}
                allowDeselect
                label="نوع المعامله"
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
                  { value: "DEPOIST", label: "ايداع" },
                  { value: "WITHDRAW", label: "سحب" },
                ]}
              />
            </Grid.Col>
          </Grid>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};
