import { AppLayout } from "@/components/AppLayout";
import type { Order, OrdersFilter } from "@/services/getOrders";
import { Button, LoadingOverlay, TextInput, Grid } from "@mantine/core";
import { useState } from "react";
import toast from "react-hot-toast";
import { columns } from "./columns";
import { OrdersTable } from "../Orders/components/OrdersTable";
import { useRepositoryOrders } from "@/hooks/useOrders";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  EditOrderPayload,
  saveOrderInRepositoryService,
} from "@/services/editOrder";
import { AxiosError } from "axios";
import { APIError } from "@/models";
import { useAuth } from "@/store/authStore";
import { RepositoryEntriesFilters } from "./filters";
import { useDisclosure } from "@mantine/hooks";
import { ConfirmOrderNumber } from "@/components/SelectFromMultiOrders/SelectFromMultiOrders";
import errorSound from "@/assets/error.mp3";
import successSound from "@/assets/success.mp3";

export const RepositoryOrders = () => {
  const [confirmOpened, { open: openConfirm, close: closeConfirm }] =
    useDisclosure(false);
  const [multiOrders, setMultiOrders] = useState<Order[]>([]);

  const [filters, setfilters] = useState<OrdersFilter>({
    page: 1,
    size: 10,
    pagesCount: 1,
    client_id: undefined,
    repository_id: undefined,
    store_id: undefined,
    governorate: undefined,
    secondaryStatus: "IN_REPOSITORY",
  });
  const queryClient = useQueryClient();

  const [receiptNumber, setReceiptNumber] = useState("");
  const { mainRepository } = useAuth();

  const {
    data: orders = {
      data: {
        orders: [],
      },
      pagesCount: 0,
    },
    isLoading,
  } = useRepositoryOrders(filters);

  const playSound = (path: string) => {
    const audio = new Audio(path);
    audio.play().catch(() => {}); // prevent console error if autoplay blocked
  };

  const { mutate: editOrder, isLoading: saveLoading } = useMutation({
    mutationFn: (data: { data: EditOrderPayload; id: string }) => {
      return saveOrderInRepositoryService({
        id: data.id,
        data: data.data,
      });
    },
    onSuccess: (res) => {
      if (res.multi) {
        openConfirm();
        setMultiOrders(res.data || []);
      } else {
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
        setReceiptNumber("");
        queryClient.invalidateQueries({
          queryKey: ["orders"],
        });
        queryClient.invalidateQueries({
          queryKey: ["timeline"],
        });
        closeConfirm();
        playSound(successSound);
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
      setReceiptNumber("");
      playSound(errorSound);

      closeConfirm();
    },
  });

  const confirm = async (id: string) => {
    if (mainRepository) {
      editOrder({
        data: {
          secondaryStatus: "IN_REPOSITORY",
          status: "IN_MAIN_REPOSITORY",
        },
        id: id,
      });
    } else {
      editOrder({
        data: {
          secondaryStatus: "IN_REPOSITORY",
          status: "IN_GOV_REPOSITORY",
        },
        id: id,
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      confirm(receiptNumber);
      // setReceiptNumber(""); // Clear input after saving
    }
  };

  return (
    <AppLayout>
      <RepositoryEntriesFilters filters={filters} setFilters={setfilters} />
      <Grid align="center" gutter="lg">
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
            onKeyDown={handleKeyDown}
            label="تأكيد مباشر برقم الوصل"
            type="text"
          />
        </Grid.Col>
        <Button
          className="mt-6"
          disabled={saveLoading || receiptNumber === ""}
          onClick={() => confirm(receiptNumber)}
          loading={saveLoading}>
          تأكيد
        </Button>
      </Grid>
      <div className="relative mt-12">
        <LoadingOverlay visible={isLoading} />
        <OrdersTable
          key={orders.data.orders.length}
          setFilters={setfilters}
          filters={{
            ...filters,
            pagesCount: orders.pagesCount,
          }}
          data={orders.data.orders}
          columns={columns}
        />
      </div>
      <ConfirmOrderNumber
        opened={confirmOpened}
        close={closeConfirm}
        open={openConfirm}
        orders={multiOrders}
        loading={saveLoading}
        confirm={(id) => {
          if (mainRepository) {
            editOrder({
              data: {
                secondaryStatus: "IN_REPOSITORY",
                status: "IN_MAIN_REPOSITORY",
              },
              id: id,
            });
          } else {
            editOrder({
              data: {
                secondaryStatus: "IN_REPOSITORY",
                status: "IN_GOV_REPOSITORY",
              },
              id: id,
            });
          }
        }}
      />
    </AppLayout>
  );
};
