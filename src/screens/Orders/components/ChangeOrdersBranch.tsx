import { useLocations } from "@/hooks/useLocations";
import { getSelectOptions } from "@/lib/getSelectOptions";
import { governorateArray } from "@/lib/governorateArabicNames ";
import type { APIError } from "@/models";
import { type EditOrderPayload, editOrderService } from "@/services/editOrder";
import { useOrdersStore } from "@/store/ordersStore";
import { Button, Modal, Select } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

export const ChangeOrdersBranch = () => {
  const queryClient = useQueryClient();
  const { orders: selectedOrders, deleteAllOrders } = useOrdersStore();
  const [opened, { open, close }] = useDisclosure(false);

  //   const [selectedAddress, setSelectedAddress] = useState<string | undefined>(
  //     undefined
  //   );
  const [selectedGov, setSelectedGov] = useState<string | null>(null);
  const [selectedRegoin, setSelectedRegion] = useState<string | null>(null);

  const {
    data: locationsData = {
      data: [],
    },
  } = useLocations({ size: 100000, minified: true });

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
      setSelectedGov(null);
      setSelectedRegion(null);
    },
    onError: (error: AxiosError<APIError>) => {
      toast.error(error.response?.data.message || "حدث خطأ ما");
    },
  });

  const handleSubmit = () => {
    if (selectedGov && selectedRegoin) {
      selectedOrders.forEach((order) => {
        editOrder({
          id: order.id,
          data: {
            governorate: selectedGov!!,
            locationID: +selectedRegoin!!,
            status: "CHANGE_ADDRESS",
          },
        });
      });
      toast.success("تم تعديل العنوان بنجاح");
    }
  };

  return (
    <>
      <Modal title="تغيير العنوان" opened={opened} onClose={close} centered>
        <Select
          searchable
          allowDeselect
          clearable
          value={selectedGov}
          label="المحافظة"
          placeholder="اختار المحافظة"
          data={governorateArray}
          onChange={(e) => {
            setSelectedGov(e);
          }}
        />

        <Select
          searchable
          allowDeselect
          clearable
          value={selectedRegoin}
          style={{ marginTop: "20px" }}
          label="المنطقه"
          placeholder="اختار المنطقه"
          data={
            selectedGov
              ? getSelectOptions(
                  locationsData.data.filter(
                    (l) => l.governorate === selectedGov
                  )
                )
              : []
          }
          onChange={(e) => {
            setSelectedRegion(e);
          }}
        />

        {/* <TextInput
          label="العنوان"
          placeholder=""
          style={{ marginTop: "20px" }}
          size="md"
          className="w-full"
          value={selectedAddress}
          onChange={(e) => {
            setSelectedAddress(e.target.value);
          }}
        /> */}
        <div className="flex justify-between mt-4 gap-6">
          <Button
            loading={false}
            disabled={(!selectedGov && !selectedRegoin) || isLoading}
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
        تغيير العنوان
      </Button>
    </>
  );
};
