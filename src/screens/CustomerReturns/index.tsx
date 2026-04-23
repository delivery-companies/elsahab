import { AppLayout } from "@/components/AppLayout";
import type { Order, OrdersFilter } from "@/services/getOrders";
import { Button, TextInput, Grid, Select, LoadingOverlay } from "@mantine/core";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { columns } from "./columns";
import { useTenants } from "@/hooks/useTenants";
import { getSelectOptions } from "@/lib/getSelectOptions";
import { getCustomerOrders, saveOrder } from "@/services/customerOutputs";
import { OrdersTable } from "../Orders/components/OrdersTable";
import { useGetCustomerOutputs } from "@/hooks/useGetCustomerOutputs";
import { useRepositories } from "@/hooks/useRepositories";
import { useStores } from "@/hooks/useStores";
import { useEmployees } from "@/hooks/useEmployees";
import { useOrdersStore } from "@/store/returnsStors";
import { useDisclosure } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/main";
import { AxiosError } from "axios";
import { APIError } from "@/models";
import { ConfirmOrderNumber } from "@/components/SelectFromMultiOrders/SelectFromMultiOrders";
import errorSound from "@/assets/error.mp3";
import successSound from "@/assets/success.mp3";

export const CustomerReturns = () => {
  const [orders, setOrders] = useState([]);
  const [filters, setfilters] = useState<OrdersFilter>({
    page: 1,
    size: 10,
    pagesCount: 1,
  });
  const [receiptNumber, setReceiptNumber] = useState("");
  const [company, setCompany] = useState("");
  const [repository, setRepository] = useState("");
  const [store, setStore] = useState("");
  const [target, setTarget] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const { mutateAsync: saveOrder, isLoading: isLoading } = useSaveOrder();
  const [selectedAgent, setSelectAgent] = useState("");

  const [confirmOpened, { open: openConfirm, close: closeConfirm }] =
    useDisclosure(false);
  const [multiOrders, setMultiOrders] = useState<Order[]>([]);

  const { orders: selectedOrders, deleteAllOrders } = useOrdersStore();

  useEffect(() => {
    deleteAllOrders();
  }, []);

  const playSound = (path: string) => {
    const audio = new Audio(path);
    audio.play().catch(() => {}); // prevent console error if autoplay blocked
  };

  const fetchOrders = async () => {
    setIsLoading(true);
    const respose = await getCustomerOrders({
      repository: +repository,
      storeId: +store,
      companyId: +company,
      type: target,
      page: filters.page || 1,
      size: filters.size || 10,
    });
    setIsLoading(false);
    setOrders(respose.data.orders);
    setfilters((prev) => ({ ...prev, pagesCount: respose.data.pageCount }));
  };

  const { mutate: sendOrder, isLoading: isPending } = useMutation({
    mutationFn: (data: {
      storeId: number;
      orderId: string;
      companyId: number;
      type: string;
      repository: number;
    }) => {
      return saveOrder(data);
    },
    onSuccess: (res) => {
      if (res.multi) {
        openConfirm();
        setMultiOrders(res.data || []);
      } else {
        queryClient.invalidateQueries({
          queryKey: ["customerOutputs"],
        });
        toast.success("تم إضافة الطلب بنجاح", {
          style: {
            fontSize: "25px",
            padding: "25px 30px",
            textAlign: "center",
            background: "#10B981",
            color: "#fff",
            borderRadius: "12px",
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#10B981",
          },
          position: "top-center",
          duration: 3000,
        });
        playSound(successSound);
        setReceiptNumber("");
        closeConfirm();
        fetchOrders();
      }
    },
    onError: (error: AxiosError<APIError>) => {
      toast.error(error.response?.data.message || "حدث خطأ ما", {
        style: {
          fontSize: "25px",
          padding: "25px 30px",
          background: "#EF4444",
          color: "#fff",
          borderRadius: "12px",
        },
        iconTheme: {
          primary: "#fff",
          secondary: "#EF4444",
        },
        position: "top-center",
        duration: 3000,
      });
      playSound(errorSound);
      setReceiptNumber("");
      closeConfirm();
    },
  });

  useEffect(() => {
    if (store || company || repository) {
      fetchOrders();
    }
  }, [company, store, repository, filters.page, filters.size]);

  const {
    data: storesData = {
      data: [],
    },
  } = useStores({ size: 100000, minified: true });

  const {
    data: tenantsData = {
      data: [],
    },
  } = useTenants({ size: 100000, minified: true });

  const {
    data: repositories = {
      data: [],
    },
  } = useRepositories({
    size: 100000,
    minified: true,
    type: "RETURN",
    getChildBranchs: true,
  });

  const { data: Agents } = useEmployees({
    size: 100000,
    minified: true,
    roles: ["RECEIVING_AGENT"],
  });

  const confirm = async (orderId: string) => {
    sendOrder({
      storeId: +store,
      orderId: orderId,
      companyId: +company,
      type: target,
      repository: +repository,
    });
    setReceiptNumber("");
  };

  const handleChangeOrderStatus = () => {
    if (receiptNumber.length === 0) {
      toast.error("أدخل رقم الوصل");
      return;
    }
    if (target === "") {
      toast.error("أدخل نوع الطلب");
      return;
    }
    if (target === "company" && company === "") {
      toast.error("أدخل شركة الطلب");
      return;
    }
    if (target === "client" && store === "") {
      toast.error("أدخل اسم المتجر");
      return;
    }
    if (target === "repository" && repository === "") {
      toast.error("أدخل اسم المخزن");
      return;
    }
    confirm(receiptNumber);
  };

  const { mutateAsync: createReport, isLoading: createReportLoading } =
    useGetCustomerOutputs();

  const createReportHandler = () => {
    if (target === "company" && company === "") {
      toast.error("أدخل اسم الشركه");
      return;
    }
    if (target === "client" && store === "") {
      toast.error("أدخل اسم المتجر");
      return;
    }
    if (target === "repository" && repository === "") {
      toast.error("أدخل اسم المخزن");
      return;
    }

    toast
      .promise(
        createReport({
          companyId: +company,
          storeId: +store,
          type: target,
          repositoryId: +repository,
          repositoryName:
            repositories.data.find((e) => e.id === +repository)?.name || "",
          receivingAgentId: selectedAgent ? +selectedAgent : undefined,
          orderIds:
            selectedOrders.length > 0
              ? selectedOrders.map((o) => o.id)
              : undefined,
        }),
        {
          loading: "جاري تحميل الكشف...",
          success: "تم تحميل الكشف بنجاح",
          error: (error) => error.message || "حدث خطأ ما",
        },
      )
      .then(() => {
        setOrders([]);
        deleteAllOrders();
        setCompany("");
        setRepository("");
        setTarget("");
      });
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // setReceiptNumber(""); // Clear input after saving
      handleChangeOrderStatus();
    }
  };
  return (
    <AppLayout>
      <Button
        style={{ marginBottom: "30px" }}
        disabled={orders.length === 0 || createReportLoading}
        onClick={createReportHandler}>
        انشاء كشف راجع
      </Button>
      {createReportLoading ? (
        <l-line-spinner
          size="30"
          stroke="3"
          speed="1"
          color="#e72722"></l-line-spinner>
      ) : null}
      <Grid align="center" gutter="lg">
        <Grid.Col span={{ base: 12, md: 4, lg: 2, sm: 12, xs: 12 }}>
          <TextInput
            value={receiptNumber}
            onChange={(event) => {
              const raw = event.currentTarget.value;

              const jsonIdMatch = raw.match(/"id"\s*:\s*"([^"]+)"/);
              if (jsonIdMatch?.[1]) {
                setReceiptNumber(jsonIdMatch[1]);
                return;
              }

              const trimmed = raw.trim();
              if (
                trimmed.includes("{") ||
                trimmed.includes('"id"') ||
                trimmed.includes(':"')
              ) {
                return;
              }

              // 3️⃣ Manual / fallback token
              const tokenMatch = trimmed.match(/[a-zA-Z0-9]+$/);
              if (tokenMatch?.[0]) {
                let value = tokenMatch[0];

                // 🔥 IMPORTANT FIX: remove leading "id" ONLY if it starts with it
                if (/^id/i.test(value)) {
                  value = value.replace(/^id/i, "");
                }

                setReceiptNumber(value);
                return;
              }

              // 4️⃣ Clear only if user actually cleared input
              if (trimmed.length === 0) {
                setReceiptNumber("");
              }
            }}
            onKeyDown={handleKeyDown}
            label="تأكيد مباشر برقم الوصل"
            type="text"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4, lg: 2, sm: 12, xs: 12 }}>
          <Select
            value={target}
            allowDeselect
            label="شركه \ متجر \ مخزن"
            searchable
            clearable
            onChange={(e) => {
              setTarget(e || "");
              setRepository("");
              setCompany("");
              setStore("");
            }}
            placeholder="اختر شركه \ متجر \ مخزن"
            data={[
              { value: "company", label: "شركه" },
              { value: "client", label: "متجر" },
              { value: "repository", label: "مخزن" },
            ]}
          />
        </Grid.Col>
        {target !== "" ? (
          <Grid.Col span={{ base: 12, md: 6, lg: 2, sm: 12, xs: 12 }}>
            <Select
              value={
                target === "company"
                  ? company
                  : target === "client"
                    ? store
                    : repository
              }
              allowDeselect
              label={
                target === "company"
                  ? "شركه"
                  : target === "client"
                    ? "متجر"
                    : "المخزن المرسل اليه"
              }
              searchable
              clearable
              onChange={(e) => {
                if (target === "company") {
                  setCompany(e || "");
                } else if (target === "client") {
                  setStore(e || "");
                } else {
                  setRepository(e || "");
                }
              }}
              placeholder={
                target === "company"
                  ? "اختر شركه"
                  : target === "client"
                    ? "اختر متجر"
                    : "اختر مخزن"
              }
              data={
                target === "company"
                  ? getSelectOptions(tenantsData.data)
                  : target === "client"
                    ? getSelectOptions(storesData.data)
                    : getSelectOptions(repositories.data)
              }
            />
          </Grid.Col>
        ) : null}
        {target === "client" ? (
          <Grid.Col span={{ base: 12, md: 4, lg: 3, sm: 12, xs: 12 }}>
            <Select
              value={selectedAgent}
              allowDeselect
              label="اختر مندوب للكشف"
              searchable
              clearable
              onChange={(e) => {
                setSelectAgent(e || "");
              }}
              placeholder="اختر المندوب"
              data={getSelectOptions(Agents?.data || [])}
              limit={100}
            />
          </Grid.Col>
        ) : null}
        <Button
          className="mt-6"
          disabled={isPending}
          onClick={handleChangeOrderStatus}
          loading={isPending}>
          تأكيد
        </Button>
      </Grid>
      <div className="relative mt-12">
        <LoadingOverlay visible={isLoading} />

        <OrdersTable
          key={orders.length}
          setFilters={setfilters}
          filters={{ ...filters }}
          data={orders}
          columns={columns}
        />
      </div>
      <ConfirmOrderNumber
        opened={confirmOpened}
        close={closeConfirm}
        open={openConfirm}
        orders={multiOrders}
        loading={isPending}
        confirm={(id) => {
          sendOrder({
            storeId: +store,
            orderId: id,
            companyId: +company,
            type: target,
            repository: +repository,
          });
        }}
      />
    </AppLayout>
  );
};
