import { AppLayout } from "@/components/AppLayout";
import { APIError } from "@/models";
import {
  CreateOrderReceiptPayload,
  createReceiptsService,
} from "@/services/createReciepts";
import { useForm } from "@mantine/form";
import { randomId } from "@mantine/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Button, Grid, Select, Textarea, TextInput } from "@mantine/core";
import { useState } from "react";
import toast from "react-hot-toast";
import { getSelectOptions } from "@/lib/getSelectOptions";
// import { X } from "lucide-react";
import { useBranches } from "@/hooks/useBranches";
import { useStores } from "@/hooks/useStores";
import { useAuth } from "@/store/authStore";
// import { useAuth } from "@/store/authStore";

export interface ReceiptsBulkFormValues {
  receipts: {
    id: string;
    storeId: string;
    branchId: string;
    notes: string;
  }[];
}
export const CreateBulkReceipts = () => {
  const { role, branchId } = useAuth();
  const [ordersTotals, setOrdersTotals] = useState(1);
  const [selectedClient, setSelectedClient] = useState<string | null>();
  const [selectedBranch, setSelectedBranch] = useState<string | null>();
  const [notes, setNotes] = useState<string | null>("");
  const queryClient = useQueryClient();

  const form = useForm<ReceiptsBulkFormValues>({
    initialValues: {
      receipts: [
        {
          id: randomId(),
          storeId: "",
          branchId: "",
          notes: "",
        },
      ],
    },
  });
  const {
    data: stores = {
      data: [],
    },
  } = useStores({ size: 100000, minified: true });

  const {
    data: branchs = {
      data: [],
    },
  } = useBranches({ size: 100000, minified: true });

  const { mutate: createOrderReceipt, isLoading } = useMutation({
    mutationFn: (data: CreateOrderReceiptPayload) => {
      return createReceiptsService(data);
    },
    onSuccess: () => {
      toast.success("تم اضافة الطلب بنجاح");
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
      queryClient.invalidateQueries({
        queryKey: ["ordersStatistics"],
      });
      form.reset();
      setOrdersTotals(1);
    },
    onError: (error: AxiosError<APIError>) => {
      console.log(error);

      toast.error(error.message || "حدث خطأ ما");
    },
  });

  const handleSubmit = () => {
    const ordersArray = [];
    for (let index = 0; index < ordersTotals; index++) {
      ordersArray.push({
        storeId: Number(selectedClient),
        branchId: role === "CLIENT" ? Number(branchId) : Number(selectedBranch),
        notes: notes || "",
      });
    }
    createOrderReceipt(ordersArray);
  };

  return (
    <AppLayout>
      <div className="flex items-center gap-4 mb-6">
        <TextInput
          label="عدد المصلقات"
          type="number"
          max={50}
          min={1}
          size="xs"
          value={ordersTotals}
          onChange={(e) => {
            setOrdersTotals(Number.parseInt(e.currentTarget.value));
          }}
        />
      </div>
      <Grid>
        <Grid.Col span={{ xs: 12, sm: 6, md: 4 }}>
          <Select
            clearable
            data={getSelectOptions(stores?.data || [])}
            label="المتجر"
            searchable
            // disabled={role === "CLIENT"}
            allowDeselect={false}
            placeholder="اختر المتجر"
            size="xs"
            value={selectedClient}
            onChange={(e) => {
              setSelectedClient(e);
            }}
          />
        </Grid.Col>
        {role !== "CLIENT" && role !== "CLIENT_ASSISTANT" ? (
          <Grid.Col span={{ xs: 12, sm: 6, md: 4 }}>
            <Select
              clearable
              data={getSelectOptions(branchs?.data || [])}
              label="الفرع"
              searchable
              allowDeselect={false}
              placeholder="اختر الفرع"
              size="xs"
              value={selectedBranch}
              onChange={(e) => {
                setSelectedBranch(e);
              }}
            />
          </Grid.Col>
        ) : null}
        <Grid.Col span={{ xs: 12, sm: 12, md: 12 }}>
          <Textarea
            label="ملاحظات"
            value={notes || ""}
            onChange={(e) => setNotes(e.target.value)}
            autosize
            size="l"
            minRows={3}
            style={{ maxWidth: "600px" }}
          />
        </Grid.Col>
      </Grid>
      <div>
        <Button
          loading={isLoading}
          onClick={() => {
            form.onSubmit(handleSubmit)();
          }}
          disabled={isLoading}
          type="submit"
          fullWidth
          mt="xl"
          size="md">
          رفع
        </Button>
      </div>
    </AppLayout>
  );
};
