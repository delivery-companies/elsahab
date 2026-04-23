import { ConfirmOrderNumber } from "@/components/SelectFromMultiOrders/SelectFromMultiOrders";
import type { APIError } from "@/models";
import { Order } from "@/services/getOrders";
import {
  repositoryConfirmOrderByReceiptNumberService,
  type RepositoryConfirmOrderByReceiptNumberPayload,
} from "@/services/repositoryConfirmOrderByReceiptNumber";
import { Button, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import errorSound from "@/assets/error.mp3";
import successSound from "@/assets/success.mp3";

export const SendOrderToRepository = () => {
  const queryClient = useQueryClient();
  const [receiptNumber, setReceiptNumber] = useState("");
  const [confirmOpened, { open: openConfirm, close: closeConfirm }] =
    useDisclosure(false);
  const [multiOrders, setMultiOrders] = useState<Order[]>([]);

  const playSound = (path: string) => {
    const audio = new Audio(path);
    audio.play().catch(() => {}); // prevent console error if autoplay blocked
  };

  const {
    mutate: repositoryConfirmOrderByReceiptNumber,
    isLoading: isPending,
  } = useMutation({
    mutationFn: (data: {
      data: RepositoryConfirmOrderByReceiptNumberPayload;
      id: string;
    }) => {
      return repositoryConfirmOrderByReceiptNumberService({
        orderId: data.id,
        data: data.data,
      });
    },
    onSuccess: (res) => {
      if (res.multi) {
        openConfirm();
        setMultiOrders(res.data || []);
      } else {
        queryClient.invalidateQueries({ queryKey: ["orders"] });

        toast.success("تم تعديل حالة الطلب بنجاح", {
          style: {
            fontSize: "25px",
            padding: "25px 30px",
            width: "100%",
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
      }
    },

    onError: (error: AxiosError<APIError>) => {
      toast.error(error.response?.data.message || "حدث خطأ ما", {
        style: {
          fontSize: "25px",
          padding: "25px 30px",
          textAlign: "center",
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

  const handleRepositoryConfirmOrderByReceiptNumber = () => {
    if (!receiptNumber) {
      toast.error("أدخل رقم الوصل");
      return;
    }
    repositoryConfirmOrderByReceiptNumber({
      data: {
        secondaryStatus: "IN_REPOSITORY",
      },
      id: receiptNumber,
    });
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // setReceiptNumber(""); // Clear input after saving
      handleRepositoryConfirmOrderByReceiptNumber();
    }
  };

  return (
    <div className="flex gap-4 items-center">
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

      <Button
        className="mt-6"
        disabled={isPending}
        onClick={handleRepositoryConfirmOrderByReceiptNumber}
        loading={isPending}>
        تأكيد
      </Button>

      <ConfirmOrderNumber
        opened={confirmOpened}
        close={closeConfirm}
        open={openConfirm}
        orders={multiOrders}
        loading={isPending}
        confirm={(id) => {
          repositoryConfirmOrderByReceiptNumber({
            data: {
              secondaryStatus: "IN_REPOSITORY",
            },
            id: id,
          });
        }}
      />
    </div>
  );
};
