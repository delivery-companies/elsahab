import { useEmployees } from "@/hooks/useEmployees";
import { getSelectOptions } from "@/lib/getSelectOptions";
import type { APIError } from "@/models";
import { addTransactionService } from "@/services/addTransactionService";
import { Button, Modal, NumberInput, Select } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

export const AddTransaction = () => {
  const queryClient = useQueryClient();
  const [opened, { open, close }] = useDisclosure(false);

  const [formData, setFormData] = useState({
    type: "DEPOSIT" as "DEPOSIT" | "WITHDRAW",
    for: "",
    employeeId: undefined as number | undefined,
    paidAmount: 0,
  });

  const {
    data: reportCreatedBy = {
      data: [],
    },
  } = useEmployees({
    size: 100000,
    minified: true,
    roles: [
      "ACCOUNTANT",
      "ACCOUNT_MANAGER",
      "BRANCH_MANAGER",
      "COMPANY_MANAGER",
      "DATA_ENTRY",
      "EMERGENCY_EMPLOYEE",
      "INQUIRY_EMPLOYEE",
      "RECEIVING_AGENT",
      "REPOSITORIY_EMPLOYEE",
    ],
  });

  const { mutate: addTransaction, isLoading } = useMutation({
    mutationFn: ({ data }: { data: FormData }) => addTransactionService(data),
    onSuccess: () => {
      close();
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });
      toast.success("تم تعديل العنوان بنجاح");
    },
    onError: (error: AxiosError<APIError>) => {
      toast.error(error.response?.data.message || "حدث خطأ ما");
    },
  });

  const handleSubmit = () => {
    if (formData.employeeId && formData.paidAmount && formData.type) {
      const fm = new FormData();
      fm.append("employeeId", formData.employeeId + "");
      fm.append("paidAmount", formData.paidAmount + "");
      fm.append("type", formData.type);
      fm.append("for", "");
      addTransaction({ data: fm });
    }
  };

  return (
    <>
      <Modal title="اضافه معامله" opened={opened} onClose={close} centered>
        <Select
          searchable
          allowDeselect
          clearable
          value={formData.employeeId + ""}
          style={{ marginTop: "20px" }}
          label="الموظف"
          placeholder="اختار الموظف"
          data={getSelectOptions(reportCreatedBy.data)}
          onChange={(val) => {
            setFormData((prev) => ({
              ...prev,
              employeeId: val ? +val : undefined,
            }));
          }}
          required
        />
        <Select
          allowDeselect
          clearable
          label="نوع المعاملة"
          data={[
            { value: "DEPOSIT", label: " إيداع داخل القاصه" },
            { value: "WITHDRAW", label: "سحب من القاصه" },
          ]}
          style={{ marginTop: "20px" }}
          value={formData.type}
          placeholder="اختار نوع المعاملة"
          onChange={(val) =>
            setFormData((prev) => ({
              ...prev,
              type: val as "DEPOSIT" | "WITHDRAW",
            }))
          }
          required
        />

        <NumberInput
          value={formData.paidAmount}
          style={{ marginTop: "20px" }}
          label="المبلغ"
          onChange={(val) =>
            setFormData((prev) => ({
              ...prev,
              paidAmount: +val,
            }))
          }
          required
        />
        <div className="flex justify-between mt-4 gap-6">
          <Button
            loading={false}
            disabled={
              (!formData.employeeId &&
                !formData.paidAmount &&
                !formData.type) ||
              isLoading
            }
            fullWidth
            onClick={handleSubmit}
            type="submit">
            انشاء
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

      <Button onClick={open} mt={25}>
        إنشاء معامله
      </Button>
    </>
  );
};
