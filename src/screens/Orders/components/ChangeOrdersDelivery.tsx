import { useEmployees } from "@/hooks/useEmployees";
import { getSelectOptions } from "@/lib/getSelectOptions";
import type { APIError } from "@/models";
import { type EditOrderPayload, editOrderService } from "@/services/editOrder";
import { useOrdersStore } from "@/store/ordersStore";
import { Button, Modal, Select } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

export const ChangeOrdersDelivery = () => {
  const queryClient = useQueryClient();
  const { orders: selectedOrders, deleteAllOrders } = useOrdersStore();
  const [opened, { open, close }] = useDisclosure(false);
  const { data: deliveryAgents } = useEmployees({
    size: 100000,
    minified: true,
    roles: ["DELIVERY_AGENT"],
  });
  const [selectedDelivery, setSelectedDelivery] = useState<string | null>(null);

  const { mutate: editOrder, isLoading } = useMutation({
    mutationFn: ({ data, id }: { id: string; data: EditOrderPayload }) =>
      editOrderService({
        id,
        data,
      }),
    onSuccess: () => {
      close();
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
      queryClient.invalidateQueries({
        queryKey: ["timeline"],
      });
      deleteAllOrders();
      setSelectedDelivery(null);
    },
    onError: (error: AxiosError<APIError>) => {
      toast.error(error.response?.data.message || "حدث خطأ ما");
    },
  });

  const handleSubmit = () => {
    if (selectedDelivery) {
      selectedOrders.forEach((order) => {
        editOrder({
          id: order.id,
          data: {
            secondaryStatus: "WITH_AGENT",
            status: "WITH_DELIVERY_AGENT",
            deliveryAgentID: Number(selectedDelivery),
          },
        });
      });
      toast.success("تم تعديل المندوب بنجاح");
    }
  };

  return (
    <>
      <Modal title="تغيير المندوب" opened={opened} onClose={close} centered>
        <Select
          value={selectedDelivery}
          allowDeselect
          label="المندوب"
          searchable
          clearable
          onChange={(e) => {
            setSelectedDelivery(e);
          }}
          placeholder="اختر المندوب"
          data={getSelectOptions(deliveryAgents?.data || [])}
          limit={100}
        />
        <div className="flex justify-between mt-4 gap-6">
          <Button
            loading={false}
            disabled={!selectedDelivery || isLoading}
            fullWidth
            onClick={handleSubmit}
            type="submit">
            تعديل
          </Button>

          <Button
            onClick={() => {
              close();
            }}
            fullWidth
            variant="outline">
            الغاء
          </Button>
        </div>
      </Modal>

      <Button
        style={{ flexGrow: "1" }}
        disabled={!selectedOrders.length}
        onClick={open}>
        تغيير مندوب التوصيل
      </Button>
    </>
  );
};
