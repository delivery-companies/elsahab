import { useClients } from "@/hooks/useClients";
import { useStores } from "@/hooks/useStores";
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

export const ChangeOrdersClient = () => {
  const queryClient = useQueryClient();
  const { orders: selectedOrders, deleteAllOrders } = useOrdersStore();
  const [opened, { open, close }] = useDisclosure(false);
  const { data: clientsData } = useClients({
    size: 100000,
    minified: true,
  });
  const [selectedClient, setSelectedClient] = useState<string | undefined>(
    undefined
  );
  const [selectedStore, setSelectedStore] = useState<string | undefined>(
    undefined
  );

  const {
    data: storesData = {
      data: [],
    },
  } = useStores({ size: 100000, minified: true, client_id: selectedClient });

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
      setSelectedClient(undefined);
    },
    onError: (error: AxiosError<APIError>) => {
      toast.error(error.response?.data.message || "حدث خطأ ما");
    },
  });

  const handleSubmit = () => {
    if (selectedClient && selectedStore) {
      selectedOrders.forEach((order) => {
        editOrder({
          id: order.id,
          data: {
            clientID: Number(selectedClient),
            storeID: Number(selectedStore),
          },
        });
      });
      toast.success("تم تعديل العميل و المتجر بنجاح");
    }
  };

  return (
    <>
      <Modal title="تغيير  العميل" opened={opened} onClose={close} centered>
        <Select
          value={selectedClient}
          allowDeselect
          label="العملاء"
          searchable
          clearable
          onChange={(e) => {
            setSelectedClient(e || undefined);
          }}
          placeholder="اختر العميل"
          data={getSelectOptions(clientsData?.data || [])}
          limit={100}
        />

        <Select
          value={selectedStore}
          allowDeselect
          label="المتاجر"
          searchable
          clearable
          onChange={(e) => {
            setSelectedStore(e || undefined);
          }}
          placeholder="اختر المتجر"
          data={getSelectOptions(storesData?.data || [])}
          limit={100}
        />
        <div className="flex justify-between mt-4 gap-6">
          <Button
            loading={false}
            disabled={!selectedClient || isLoading}
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
        تغيير العميل
      </Button>
    </>
  );
};
