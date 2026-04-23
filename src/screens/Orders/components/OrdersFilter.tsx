import { hideChildrenBasedOnRole } from "@/hooks/useAuthorized";
import { useAutomaticUpdates } from "@/hooks/useAutomaticUpdates";
import { useBranches } from "@/hooks/useBranches";
import { useClients } from "@/hooks/useClients";
import { useCreateReportsDocumentation } from "@/hooks/useCreateReportsDocumentation";
import { useEmployees } from "@/hooks/useEmployees";
import { useLocations } from "@/hooks/useLocations";
import { useStores } from "@/hooks/useStores";
import { deliveryTypesArray } from "@/lib/deliveryTypesArabicNames";
import {
  processedOrdersOptions,
  withReportsDataOptions,
} from "@/lib/getReportParam";
import { getSelectOptions } from "@/lib/getSelectOptions";
import {
  governorateArabicNames,
  governorateArray,
} from "@/lib/governorateArabicNames ";
import {
  orderStatusArabicNames,
  orderStatusArray,
} from "@/lib/orderStatusArabicNames";
import type { OrdersFilter as IOrdersFilter } from "@/services/getOrders";
import { useAuth } from "@/store/authStore";
import { useOrdersStore } from "@/store/ordersStore";
import {
  Accordion,
  Button,
  Grid,
  Menu,
  MultiSelect,
  Select,
  Switch,
  TagsInput,
  TextInput,
  rem,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { format, parseISO } from "date-fns";
import "dayjs/locale/ar";
import toast from "react-hot-toast";
// import { ChangeOrdersBranch } from "./ChangeOrdersBranch";
import { ChangeOrdersClient } from "./ChangeOrdersClient";
import { ChangeOrdersDelivery } from "./ChangeOrdersDelivery";
import { ChangeOrdersStatus } from "./ChangeOrdersStatus";
import { DeleteAllSelectedOrdersModal } from "./DeleteAllSelectedOrdersModal";
import { ExportReportModal } from "./ExportReportModal";
// import { ForwardOrdersToCompany } from "./ForwardOrdersToCompany";
import { ordersFilterInitialState } from "..";
import { ChangeOrdersBranch } from "./ChangeOrdersBranch";
import { useState } from "react";
// import { ProcessedSelectedOrders } from "./ProcessedSelectedOrders";

const secondaryStatusFilter = [
  { value: "WITH_AGENT", label: "مع المندوب" },
  { value: "IN_REPOSITORY", label: "في مخزن الفرع" },
  { value: "IN_CAR", label: "في المخزن الرئيسي" },
  { value: "WITH_RECEIVING_AGENT", label: "مع مندوب الاستلام" },
  { value: "WITH_CLIENT", label: "مع العميل" },
];

type NoteOption = {
  value: string;
  label: string;
};

const NOTES_OPTIONS: Record<string, NoteOption[]> = {
  RETURNED: [
    { value: "لا يرد بعد المعالجة", label: "لا يرد بعد المعالجة" },
    { value: "رفض الطلب", label: "رفض الطلب" },
    { value: "حظر المندوب", label: "حظر المندوب" },
    { value: "تالف", label: "تالف" },
    { value: "تم الوصول والرفض", label: "تم الوصول والرفض" },
    { value: "خطأ بالعنوان", label: "خطأ بالعنوان" },
    { value: "مستلم مسبقاً", label: "مستلم مسبقاً" },
    { value: "خطأ بالتجهيز", label: "خطأ بالتجهيز" },
    { value: "إلغاء الحجز", label: "إلغاء الحجز" },
    { value: "لم يعالج الطلب", label: "لم يعالج الطلب" },
    { value: "كاذب", label: "كاذب" },
    { value: "مكرر", label: "مكرر" },
  ],
  POSTPONED: [
    { label: "مؤجل غدا", value: "مؤجل غدا" },
    { label: "مؤجل لأكثر من يوم", value: "مؤجل لأكثر من يوم" },
    { label: "مؤجل ليلا", value: "مؤجل ليلا" },
  ],
  PROCESSING: [
    { value: "لا يرد مع رسالة", label: "لا يرد مع رسالة" },
    { value: "مغلق", label: "مغلق" },
    { value: "نقص رقم", label: "نقص رقم" },
    { value: "لا يمكن الاتصال به", label: "لا يمكن الاتصال به" },
    { value: "زيادة رقم", label: "زيادة رقم" },
    { value: "الرقم غير معرف", label: "الرقم غير معرف" },
    { value: "غير داخل بالخدمة", label: "غير داخل بالخدمة" },
    { value: "لم يطلب", label: "لم يطلب" },
    { value: "تعديل سعر", label: "تعديل سعر" },
  ],
};

interface OrdersFilter {
  filters: IOrdersFilter;
  setFilters: React.Dispatch<React.SetStateAction<IOrdersFilter>>;
  search: string;
  setSearch: (newValue: string) => void;
  currentPageOrdersIDs?: string[];
  // receiptError: string | null;
}

export const CustomOrdersFilter = ({
  filters,
  setFilters,
  setSearch,
  currentPageOrdersIDs,
}: // receiptError,
OrdersFilter) => {
  const { role, mainRepository } = useAuth();
  const [searchInput, setSearchInput] = useState<string>();
  const { orders: selectedOrders, deleteAllOrders } = useOrdersStore();
  const { mutateAsync: crateOrdersDocumentationPDF, isLoading } =
    useCreateReportsDocumentation();
  const {
    data: clientsData = {
      data: [],
    },
  } = useClients({ size: 100000, minified: true });

  const {
    data: storesData = {
      data: [],
    },
  } = useStores({ size: 100000, minified: true });

  const {
    data: locationsData = {
      data: [],
    },
  } = useLocations({ size: 100000, minified: true });

  const {
    data: employeesData = {
      data: [],
    },
  } = useEmployees({
    size: 100000,
    minified: true,
    roles: ["DELIVERY_AGENT"],
  });

  const {
    data: employees = {
      data: [],
    },
  } = useEmployees({
    size: 100000,
    minified: true,
  });

  const {
    data: branchesData = {
      data: [],
    },
  } = useBranches({
    size: 100000,
    minified: true,
    governorate:
      (filters.governorate as keyof typeof governorateArabicNames) || undefined,
    getAll: "true",
  });

  const { data: automaticUpdatesData } = useAutomaticUpdates(
    {
      size: 100000,
      minified: true,
    },
    role === "COMPANY_MANAGER",
  );

  const transformedAutomaticUpdates = automaticUpdatesData?.data.map(
    (update) => ({
      value: update.id.toString(),
      label: `${orderStatusArabicNames[update.orderStatus]} - ${
        update.notes ? update.notes + " - " : ""
      } ${update.branch.name}`,
    }),
  );

  const convertDateFormat = (date: Date | null): string | null => {
    if (date) {
      const parsedDate = parseISO(date.toISOString());
      return format(parsedDate, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
    }
    return null;
  };

  const handleCreateOrdersDocumentationForSelectedOrders = () => {
    const selectedReportsIDs = selectedOrders.map((order) => order.id);
    toast.promise(
      crateOrdersDocumentationPDF(
        {
          ordersIDs: selectedReportsIDs,
          type: "GENERAL",
          params: filters,
        },
        {
          onSuccess: () => {
            deleteAllOrders();
          },
        },
      ),
      {
        loading: "جاري تحميل تقرير...",
        success: "تم تحميل تقرير بنجاح",
        error: (error) => error.message || "حدث خطأ ما",
      },
    );
  };

  const handleExportCurrentPage = () => {
    if (!currentPageOrdersIDs) return;
    toast.promise(
      crateOrdersDocumentationPDF({
        ordersIDs: currentPageOrdersIDs,
        type: "GENERAL",
        params: filters,
      }),
      {
        loading: "جاري تحميل تقرير...",
        success: "تم تحميل تقرير بنجاح",
        error: (error) => error.message || "حدث خطأ ما",
      },
    );
  };

  const handleExportAll = () => {
    toast.promise(
      crateOrdersDocumentationPDF({
        ordersIDs: "*",
        type: "GENERAL",
        params: filters || {},
      }),
      {
        loading: "جاري تحميل تقرير بكل الطلبات",
        success: "تم تحميل تقرير بكل الطلبات بنجاح",
        error: (error) => error.message || "حدث خطأ ما",
      },
    );
  };

  const notesOptions: NoteOption[] = filters.statuses?.length
    ? Array.from(
        new Map(
          filters.statuses
            .filter((status) => status in NOTES_OPTIONS)
            .flatMap((status) => NOTES_OPTIONS[status])
            .map((item) => [item.value, item]),
        ).values(),
      )
    : [];

  return (
    <>
      <Grid align="center" gutter="lg" className="mb-4">
        <Grid.Col span={{ base: 12, md: 12, lg: 12, sm: 12, xs: 12 }}>
          <div className="flex items-center gap-2 flex-wrap">
            <ExportReportModal />
            <Menu shadow="md" width={rem(180)}>
              <Menu.Target>
                <Button style={{ flexGrow: "1", maxWidth: "250px" }}>
                  انشاء تقارير
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>اختار النوع</Menu.Label>
                <Menu.Item disabled={isLoading} onClick={handleExportAll}>
                  تصدير الكل{" "}
                </Menu.Item>
                <Menu.Item
                  disabled={currentPageOrdersIDs?.length === 0 || isLoading}
                  onClick={handleExportCurrentPage}>
                  تصدير الصفحة الحالية
                </Menu.Item>
                <Menu.Item
                  disabled={selectedOrders.length === 0 || isLoading}
                  onClick={handleCreateOrdersDocumentationForSelectedOrders}>
                  تصدير الصفوف المحددة
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
            {hideChildrenBasedOnRole(
              ["CLIENT"],
              <>
                <ChangeOrdersBranch />
                <ChangeOrdersClient />
                <ChangeOrdersDelivery />
                <ChangeOrdersStatus />
                {/* <ForwardOrdersToCompany /> */}
              </>,
            )}
            {role === "COMPANY_MANAGER" && <DeleteAllSelectedOrdersModal />}
          </div>
        </Grid.Col>
      </Grid>
      <Accordion variant="separated">
        <Accordion.Item className="rounded-md mb-8" value="orders-filter">
          <Accordion.Control> الفلاتر </Accordion.Control>
          <Accordion.Panel>
            <Grid align="center" gutter="lg">
              <Grid.Col span={{ base: 12, md: 6, lg: 3, sm: 12, xs: 12 }}>
                <TagsInput
                  label="بحث برقم الوصل"
                  placeholder="أدخل أرقام الوصل"
                  value={filters.receipt_numbers || []}
                  onChange={(newValues) => {
                    // نسمح بس للأرقام
                    const onlyNumbers = newValues
                      .map((v) => {
                        const match = v.match(/\d+/);
                        return match ? match[0] : null;
                      })
                      .filter((v): v is string => v !== null);

                    setFilters((prev) => ({
                      ...prev,
                      receipt_numbers: onlyNumbers,
                    }));
                  }}
                  // error={receiptError}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6, lg: 3, sm: 12, xs: 12 }}>
                <TextInput
                  placeholder="رقم الكشف, اسم, عنوان او رقم هاتف المستلم"
                  value={searchInput || ""}
                  label="بحث"
                  onBlur={() => {
                    setSearch(searchInput || "");
                  }}
                  onChange={(e) => {
                    setSearchInput(e.currentTarget.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      setSearch(searchInput || "");
                    }
                  }}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6, lg: 3, sm: 12, xs: 12 }}>
                <Select
                  value={filters.governorate || null}
                  allowDeselect
                  label="المحافظة"
                  searchable
                  clearable
                  onChange={(e) => {
                    setFilters({
                      ...filters,
                      governorate: e || "",
                    });
                  }}
                  placeholder="اختر المحافظة"
                  data={governorateArray}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6, lg: 3, sm: 12, xs: 12 }}>
                <MultiSelect
                  value={filters.statuses || []}
                  label="الحالة"
                  searchable
                  clearable
                  onChange={(e) => {
                    setFilters({
                      ...filters,
                      statuses: e || "",
                    });
                  }}
                  placeholder="اختر الحالة"
                  data={orderStatusArray}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, xs: 12, sm: 12, md: 6, lg: 3 }}>
                <Select
                  label="حالات المؤجل / الراجع / المعالجة"
                  placeholder="اختر الحالة"
                  searchable
                  clearable
                  allowDeselect
                  limit={100}
                  value={filters.notes || null}
                  data={notesOptions}
                  onChange={(value) =>
                    setFilters({
                      ...filters,
                      notes: value || undefined,
                    })
                  }
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6, lg: 3, sm: 12, xs: 12 }}>
                <Select
                  value={filters.confirmed ? "true" : "false"}
                  label="التأكيد"
                  searchable
                  clearable
                  onChange={(e) => {
                    if (e === "true") {
                      setFilters({
                        ...filters,
                        confirmed: true,
                      });
                    } else {
                      setFilters({
                        ...filters,
                        confirmed: false,
                      });
                    }
                  }}
                  placeholder="اختر الحالة"
                  data={[
                    { value: "true", label: "تم تأكيدها من الشركه" },
                    { value: "false", label: "لم يتم تأكيدها من الشركه" },
                  ]}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6, lg: 3, sm: 12, xs: 12 }}>
                <Select
                  value={filters.store_id || null}
                  allowDeselect
                  label="المتجر"
                  searchable
                  clearable
                  onChange={(e) => {
                    setFilters({
                      ...filters,
                      store_id: e || "",
                    });
                  }}
                  placeholder="اختر المتجر"
                  data={getSelectOptions(storesData.data)}
                  limit={100}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6, lg: 3, sm: 12, xs: 12 }}>
                <Select
                  value={filters.location_id || null}
                  allowDeselect
                  label="المناطق"
                  searchable
                  clearable
                  onChange={(e) => {
                    setFilters({
                      ...filters,
                      location_id: e || "",
                    });
                  }}
                  placeholder="اختر المنطقة"
                  data={getSelectOptions(locationsData.data)}
                  limit={100}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6, lg: 3, sm: 12, xs: 12 }}>
                <Select
                  value={filters.sort || null}
                  allowDeselect
                  label="الترتيب"
                  searchable
                  clearable
                  onChange={(e) => {
                    setFilters({
                      ...filters,
                      sort: e || "",
                    });
                  }}
                  placeholder="اختر الترتيب"
                  data={[
                    {
                      label: "الأحدث",
                      value: "id:desc",
                    },
                    {
                      label: "الأقدم",
                      value: "id:asc",
                    },
                  ]}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4, lg: 3, sm: 12, xs: 12 }}>
                <Select
                  label="كشف عميل"
                  placeholder="اختر كشف عميل"
                  data={withReportsDataOptions}
                  clearable
                  value={filters.client_report || null}
                  onChange={(e) => {
                    setFilters({
                      ...filters,
                      client_report: e,
                    });
                  }}
                />
              </Grid.Col>
              {role === "COMPANY_MANAGER" && (
                <Grid.Col span={{ base: 12, md: 6, lg: 3, sm: 12, xs: 12 }}>
                  <Select
                    value={filters.automatic_update_id || null}
                    allowDeselect
                    label="طلبات التحديث التلقائي"
                    searchable
                    clearable
                    onChange={(e) => {
                      setFilters({
                        ...filters,
                        automatic_update_id: e || "",
                      });
                    }}
                    placeholder="اختر طلب التحديث التلقائي"
                    data={transformedAutomaticUpdates}
                  />
                </Grid.Col>
              )}
              {role !== "CLIENT" &&
              role !== "CLIENT_ASSISTANT" &&
              role !== "EMPLOYEE_CLIENT_ASSISTANT" &&
              role !== "ADMIN_ASSISTANT" ? (
                <>
                  <Grid.Col span={{ base: 12, md: 6, lg: 3, sm: 12, xs: 12 }}>
                    <Select
                      value={filters.delivery_type || null}
                      allowDeselect
                      label="نوع التوصيل"
                      searchable
                      clearable
                      onChange={(e) => {
                        setFilters({
                          ...filters,
                          delivery_type: e || "",
                        });
                      }}
                      placeholder="اختر نوع التوصيل"
                      data={deliveryTypesArray}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6, lg: 3, sm: 12, xs: 12 }}>
                    <Select
                      value={filters.branch_id || null}
                      allowDeselect
                      label="الفرع"
                      searchable
                      clearable
                      onChange={(e) => {
                        setFilters({
                          ...filters,
                          branch_id: e || "",
                        });
                      }}
                      placeholder="اختر الفرع"
                      data={getSelectOptions(branchesData.data)}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6, lg: 3, sm: 12, xs: 12 }}>
                    <Select
                      value={filters.orderType}
                      allowDeselect
                      label="نوع البريد"
                      searchable
                      clearable
                      onChange={(e) => {
                        setFilters({
                          ...filters,
                          orderType: e || "",
                          client_report: e === "forwarded" ? "1" : undefined,
                          delivered: e === "forwarded" ? true : undefined,
                        });
                      }}
                      placeholder="اختر نوع البريد"
                      limit={100}
                      data={
                        role === "COMPANY_MANAGER" || mainRepository
                          ? [
                              { value: "forwardedAll", label: "البريد الوارد" },
                              { value: "receivedAll", label: "البريد الصادر" },
                              { value: "inside", label: "البريد الداخلي" },
                            ]
                          : [
                              { value: "forwardedAll", label: "البريد الصادر" },
                              { value: "receivedAll", label: "البريد الوارد" },
                              { value: "inside", label: "البريد الداخلي" },
                            ]
                      }
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
                  <Grid.Col span={{ base: 12, md: 6, lg: 3, sm: 12, xs: 12 }}>
                    <Select
                      value={filters.delivery_agent_id?.toString() || null}
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
                      data={getSelectOptions(employeesData.data)}
                      limit={100}
                    />
                  </Grid.Col>

                  <Grid.Col span={{ base: 12, md: 6, lg: 3, sm: 12, xs: 12 }}>
                    <Select
                      value={filters.secondaryStatus || null}
                      allowDeselect
                      label="نوع الحاله"
                      searchable
                      clearable
                      onChange={(e) => {
                        setFilters({
                          ...filters,
                          secondaryStatus: e || undefined,
                        });
                      }}
                      placeholder="اختر الحاله"
                      data={secondaryStatusFilter}
                      limit={100}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 4, lg: 3, sm: 12, xs: 12 }}>
                    <Select
                      label="كشف فرع"
                      placeholder="اختر كشف فرع"
                      data={withReportsDataOptions}
                      clearable
                      value={filters.branch_report || null}
                      onChange={(e) => {
                        setFilters({
                          ...filters,
                          branch_report: e,
                        });
                      }}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 4, lg: 3, sm: 12, xs: 12 }}>
                    <Select
                      label="كشف مندوب"
                      placeholder="اختر كشف مندوب"
                      data={withReportsDataOptions}
                      clearable
                      value={filters.delivery_agent_report || null}
                      onChange={(e) => {
                        setFilters({
                          ...filters,
                          delivery_agent_report: e,
                        });
                      }}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 4, lg: 3, sm: 12, xs: 12 }}>
                    <Select
                      label="كشف محافظة"
                      placeholder="اختر كشف محافظة"
                      data={withReportsDataOptions}
                      clearable
                      value={filters.governorate_report || null}
                      onChange={(e) => {
                        setFilters({
                          ...filters,
                          governorate_report: e,
                        });
                      }}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 4, lg: 3, sm: 12, xs: 12 }}>
                    <Select
                      label="معالجة"
                      placeholder="اختر الحالة"
                      data={processedOrdersOptions}
                      clearable
                      value={filters.processingStatus || null}
                      onChange={(e) => {
                        setFilters({
                          ...filters,
                          processingStatus: e,
                        });
                      }}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 4, lg: 3, sm: 12, xs: 12 }}>
                    <Select
                      label="كشف شركة"
                      placeholder="اختر كشف شركة"
                      data={withReportsDataOptions}
                      clearable
                      value={filters.company_report || null}
                      onChange={(e) => {
                        setFilters({
                          ...filters,
                          company_report: e,
                        });
                      }}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 4, lg: 3, sm: 12, xs: 12 }}>
                    <Select
                      label="كشف مخزن"
                      placeholder="اختر كشف مخزن"
                      data={withReportsDataOptions}
                      clearable
                      value={filters.repository_report || null}
                      onChange={(e) => {
                        setFilters({
                          ...filters,
                          repository_report: e,
                        });
                      }}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 4, lg: 3, sm: 12, xs: 12 }}>
                    <DatePickerInput
                      valueFormat="DD MMM YYYY"
                      label="تاريخ تحديث الحاله"
                      value={
                        filters.delivery_date
                          ? new Date(filters.delivery_date)
                          : null
                      }
                      placeholder="اختر تاريخ البداية"
                      locale="ar"
                      clearable
                      onChange={(date) => {
                        const newDeliveryDate = convertDateFormat(date);
                        setFilters({
                          ...filters,
                          delivery_date: newDeliveryDate,
                        });
                      }}
                    />
                  </Grid.Col>
                </>
              ) : null}
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
                  value={
                    filters.start_date ? new Date(filters.start_date) : null
                  }
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
              <Grid.Col span={{ base: 12, md: 6, lg: 3, sm: 12, xs: 12 }}>
                <Select
                  value={filters.created_by?.toString() || null}
                  allowDeselect
                  label="من قام بإنشاء الطلب"
                  searchable
                  clearable
                  onChange={(e) => {
                    setFilters({
                      ...filters,
                      created_by: e || "",
                    });
                  }}
                  placeholder="اختر الموظف"
                  data={getSelectOptions(employees.data)}
                  limit={100}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6, lg: 3, sm: 12, xs: 12 }}>
                <Select
                  value={filters.updated_by?.toString() || null}
                  allowDeselect
                  label="من قام بتحديث الطلب"
                  searchable
                  clearable
                  onChange={(e) => {
                    setFilters({
                      ...filters,
                      updated_by: e || "",
                    });
                  }}
                  placeholder="اختر الموظف"
                  data={getSelectOptions(employees.data)}
                  limit={100}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 6, md: 6, lg: 2, sm: 12, xs: 12 }}>
                <Switch
                  label="حذف المكرر"
                  placeholder=""
                  checked={filters.removeRepeated}
                  onChange={(e) => {
                    setFilters({
                      ...filters,
                      removeRepeated: e.target.checked,
                    });
                  }}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6, lg: 3, sm: 12, xs: 12 }}>
                <Button
                  mt={20}
                  onClick={() => {
                    setFilters({
                      ...ordersFilterInitialState,
                      governorate: "",
                      branch_report: undefined,
                      client_report: undefined,
                      company_report: undefined,
                      delivery_agent_report: undefined,
                      governorate_report: undefined,
                      repository_report: undefined,
                      processingStatus: undefined,
                    });
                    setSearch("");
                  }}>
                  افراغ الحقول
                </Button>
              </Grid.Col>
            </Grid>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </>
  );
};
