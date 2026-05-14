import { AppLayout } from "@/components/AppLayout";
import { useOrders } from "@/hooks/useOrders";
import type { Order, OrdersFilter } from "@/services/getOrders";
import { useAuth } from "@/store/authStore";
import { Button, Grid, LoadingOverlay, Select, TextInput } from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import { useState } from "react";
// import { ordersFilterInitialState } from "../Orders";
import { OrdersTable } from "../Orders/components/OrdersTable";
import { ForwardedOrdersToCompanyFilters } from "./ForwardedOrdersToCompanyFilters";
import { useTenants } from "@/hooks/useTenants";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { APIError } from "@/models";
import { getSelectOptions } from "@/lib/getSelectOptions";
import { columns } from "./columns";
import { useDisclosure } from "@mantine/hooks";
import { ConfirmOrderNumber } from "@/components/SelectFromMultiOrders/SelectFromMultiOrders";
import errorSound from "@/assets/error.mp3";
import successSound from "@/assets/success.mp3";
import toast from "react-hot-toast";
import { queryClient } from "@/main";
import { forwardOrderService } from "@/services/editOrder";

export const ForwardedOrdersToCompany = () => {
  const { companyID } = useAuth();
  const [receiptNumber, setReceiptNumber] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [multiOrders, setMultiOrders] = useState<Order[]>([]);
  const [confirmOpened, { open: openConfirm, close: closeConfirm }] =
    useDisclosure(false);

  const [filters, setFilters] = useState<OrdersFilter>({
    page: 1,
    size: 10,
    deleted: false,
    forwarded: true,
    forwarded_from_id: companyID,
    confirmed: undefined,
    secondaryStatus: "SEND_TO_COMPANY",
  });

  const [search, setSearch] = useDebouncedState("", 300);

  const {
    data: tenantsData = {
      data: [],
    },
  } = useTenants({ size: 100000, minified: true });

  const {
    data: orders = {
      data: {
        orders: [],
      },
      pagesCount: 0,
    },
    isError,
    isInitialLoading,
  } = useOrders({
    ...filters,
    search,
  });

  const playSound = (path: string) => {
    const audio = new Audio(path);
    audio.play().catch(() => {}); // prevent console error if autoplay blocked
  };

  const { mutate: editOrder, isLoading: saveLoading } = useMutation({
    mutationFn: (data: {
      data: {
        companyId: number;
      };
      id: string;
    }) => {
      return forwardOrderService({
        id: data.id,
        data: {
          companyId: data.data.companyId,
        },
      });
    },
    onSuccess: (res) => {
      if (res.multi) {
        openConfirm();
        setMultiOrders(res.data || []);
      } else {
        toast.success("تم إرسال الطلب بنجاح", {
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
        setReceiptNumber("");
        queryClient.invalidateQueries({
          queryKey: ["orders"],
        });
        queryClient.invalidateQueries({
          queryKey: ["timeline"],
        });
        playSound(successSound);

        closeConfirm();
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      confirm(receiptNumber);
      // setReceiptNumber(""); // Clear input after saving
    }
  };

  const confirm = async (id: string) => {
    if (selectedCompany === "") {
      toast.error("الرجاء تحديد مخزن");
      return;
    }
    editOrder({
      data: {
        companyId: +selectedCompany,
      },
      id,
    });
  };

  return (
    <AppLayout isError={isError}>
      <ForwardedOrdersToCompanyFilters
        filters={filters}
        search={search}
        setFilters={setFilters}
        setSearch={setSearch}
      />
      <Grid align="center" gutter="lg" mt={30}>
        <Grid.Col span={{ base: 12, md: 4, lg: 3, sm: 12, xs: 12 }}>
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
            label="إحاله الطلبات إلي شركة"
            onKeyDown={handleKeyDown}
            type="text"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4, lg: 3, sm: 12, xs: 12 }}>
          <Select
            value={selectedCompany}
            allowDeselect
            label="الشركة"
            searchable
            clearable
            onChange={(e) => {
              setSelectedCompany(e || "");
            }}
            placeholder="اختر الشركة"
            data={getSelectOptions(tenantsData?.data || [])}
            limit={100}
          />
        </Grid.Col>
        <Button
          className="mt-6"
          disabled={
            saveLoading || receiptNumber === "" || selectedCompany === ""
          }
          onClick={() => confirm(receiptNumber)}
          loading={saveLoading}>
          تأكيد
        </Button>
      </Grid>
      <div className="relative mt-12">
        <LoadingOverlay visible={isInitialLoading} />
        <OrdersTable
          columns={columns}
          data={orders.data.orders}
          setFilters={setFilters}
          filters={{
            ...filters,
            pagesCount: orders.pagesCount,
          }}
        />
      </div>
      <ConfirmOrderNumber
        opened={confirmOpened}
        close={closeConfirm}
        open={openConfirm}
        orders={multiOrders}
        loading={saveLoading}
        confirm={(id) => {
          confirm(id);
        }}
      />
    </AppLayout>
  );
};
