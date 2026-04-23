import { AppLayout } from "@/components/AppLayout";
import type { Order, OrdersMetaData } from "@/services/getOrders";
import { Button, TextInput, Grid } from "@mantine/core";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EditOrderPayload, editOrderService } from "@/services/editOrder";
import { AxiosError } from "axios";
import { APIError } from "@/models";
import { randomId, useDisclosure } from "@mantine/hooks";
import { ConfirmOrderNumber } from "@/components/SelectFromMultiOrders/SelectFromMultiOrders";
import errorSound from "@/assets/error.mp3";
import successSound from "@/assets/success.mp3";
import { useOrders } from "@/hooks/useOrders";
import { OrderItem } from "./OrderItem";
import { useForm, zodResolver } from "@mantine/form";
import { CreateBulkOrdersSchema, createOrderSchema } from "./schema";

export const EditPaperOrder = () => {
  const form = useForm<CreateBulkOrdersSchema>({
    initialValues: {
      id: randomId(),
      withProducts: false,
      recipientPhones: [
        {
          phone: "",
          key: randomId(),
        },
      ],
      totalCost: "",
      quantity: "1",
      storeID: "",
      locationID: "",
      deliveryType: "",
      governorate: "",
      recipientName: "",
      recipientAddress: "",
      receiptNumber: "",
      details: "",
      notes: "",
    },
    validate: zodResolver(createOrderSchema),
  });

  const [confirmOpened, { open: openConfirm, close: closeConfirm }] =
    useDisclosure(false);

  const [multiOrders, setMultiOrders] = useState<Order[]>([]);

  const [order, setOrder] = useState<Order | undefined>(undefined);

  const queryClient = useQueryClient();

  const [receiptNumber, setReceiptNumber] = useState("");
  const [finalReceiptNumber, setFinalReceiptNumber] = useState<
    string | undefined
  >(undefined);

  const {
    data: orders = {
      data: {
        orders: [],
        ordersMetaData: {} as OrdersMetaData,
      },
      pagesCount: 0,
    },
    isFetching,
    isSuccess,
  } = useOrders(
    {
      page: 1,
      size: 1000,
      statuses: [
        "REGISTERED",
        "READY_TO_SEND",
        "IN_GOV_REPOSITORY",
        "IN_MAIN_REPOSITORY",
        "WITH_DELIVERY_AGENT",
        "WITH_RECEIVING_AGENT",
      ],
      receipt_number: finalReceiptNumber,
      from: "DELETED",
    },
    !!finalReceiptNumber,
  );

  useEffect(() => {
    if (!finalReceiptNumber) return;
    if (!isSuccess) return;
    if (isFetching) return;

    if (orders.data.orders.length === 0) {
      form.reset();
      toast.error("الطلب غير موجود", {
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
    }
    if (orders.data.orders.length === 1) {
      const selectedOrder = orders.data.orders[0];
      setOrder(orders.data.orders[0]);
      form.setValues({
        id: selectedOrder.id,
        recipientPhones: [
          {
            phone: selectedOrder.recipientPhones[0],
            key: randomId(),
          },
        ],
        totalCost: selectedOrder.totalCost + "",
        quantity: selectedOrder.quantity + "",
        storeID: selectedOrder.store.id + "",
        locationID: selectedOrder.location?.id + "",
        deliveryType: selectedOrder.deliveryType,
        governorate: selectedOrder.governorate,
        recipientName: selectedOrder.recipientName,
        recipientAddress: selectedOrder.recipientAddress,
        receiptNumber: selectedOrder.receiptNumber,
        details: selectedOrder.details,
        notes: selectedOrder.notes,
      });
    }
    if (orders.data.orders.length > 1) {
      setMultiOrders(orders.data.orders);
      openConfirm();
    }
  }, [finalReceiptNumber, isSuccess, isFetching, orders.data.orders.length]);

  const playSound = (path: string) => {
    const audio = new Audio(path);
    audio.play().catch(() => {}); // prevent console error if autoplay blocked
  };

  const { mutate: editOrder, isLoading: saveLoading } = useMutation({
    mutationFn: (data: EditOrderPayload) => {
      return editOrderService({
        id: order?.id!!,
        data,
      });
    },
    onSuccess: () => {
      toast.success("تم تعديل الطلب بنجاح", {
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
    setFinalReceiptNumber(id);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      confirm(receiptNumber);
      // setReceiptNumber(""); // Clear input after saving
    }
  };

  return (
    <AppLayout>
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
            label="أدخل رقم الوصل"
            type="text"
          />
        </Grid.Col>
        <Button
          className="mt-6"
          disabled={saveLoading || receiptNumber === ""}
          onClick={() => confirm(receiptNumber)}
          loading={isFetching}>
          تأكيد
        </Button>
      </Grid>
      <OrderItem form={form} />
      <Button
        className="mt-6"
        disabled={saveLoading || order === undefined}
        onClick={() => {
          editOrder({
            details: form.values.details || "",
            notes: form.values.notes || "",
            recipientAddress: form.values.recipientAddress,
            recipientName: form.values.recipientName,
            recipientPhones: form.values.recipientPhones.map(
              (phone) => phone.phone,
            ),
            quantity: Number(form.values.quantity) || 1,
            governorate: form.values.governorate,
            locationID: +form.values.locationID!!,
            storeID: +form.values.storeID,
            clientID: order?.clientID,
            totalCost: +form.values.totalCost,
          });
        }}
        loading={saveLoading}>
        حفظ
      </Button>
      <ConfirmOrderNumber
        opened={confirmOpened}
        close={closeConfirm}
        open={openConfirm}
        orders={multiOrders}
        loading={saveLoading}
        confirm={(id) => {
          const selectedOrder = orders.data.orders.find((o) => o.id === id);
          setOrder(orders.data.orders.find((o) => o.id === id));
          form.setValues({
            id: selectedOrder?.id,
            recipientPhones: [
              {
                phone: selectedOrder?.recipientPhones[0] || "",
                key: randomId(),
              },
            ],
            totalCost: selectedOrder?.totalCost + "",
            quantity: selectedOrder?.quantity + "",
            storeID: selectedOrder?.store.id + "",
            locationID: selectedOrder?.location?.id + "",
            deliveryType: selectedOrder?.deliveryType,
            governorate: selectedOrder?.governorate,
            recipientName: selectedOrder?.recipientName,
            recipientAddress: selectedOrder?.recipientAddress,
            receiptNumber: selectedOrder?.receiptNumber,
            details: selectedOrder?.details,
            notes: selectedOrder?.notes,
          });
          closeConfirm();
        }}
      />
    </AppLayout>
  );
};
