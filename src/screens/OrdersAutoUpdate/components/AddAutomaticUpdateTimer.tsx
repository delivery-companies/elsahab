import { orderReturnConditionArray } from "@/lib/orderReturnConditionArabicNames";
import { orderStatusArray } from "@/lib/orderStatusArabicNames";
import type { APIError } from "@/models";
import {
  type CreateAutomaticUpdateDatePayload,
  createAutomaticUpdateDateService,
} from "@/services/createAutomaticUpdateDate";
import { Button, Modal, NumberInput, Radio, Select } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import type { z } from "zod";
import { orderStatusAutomaticUpdateCreateSchema } from "./AddAutomaticUpdateTimer.zod";

interface Props {
  branchId?: string | null;
}
export const AddAutomaticUpdateTimer = ({ branchId }: Props) => {
  const queryClient = useQueryClient();
  const [opened, { open, close }] = useDisclosure(false);
  const form = useForm({
    validate: zodResolver(orderStatusAutomaticUpdateCreateSchema),
    initialValues: {
      governorate: "",
      orderStatus: "",
      newOrderStatus: "",
      checkAfter: 0,
      updateAt: 0,
      returnCondition: "UNKNOWN",
      notes: "",
    },
  });

  const { mutate: createDate, isLoading } = useMutation({
    mutationFn: (data: CreateAutomaticUpdateDatePayload) =>
      createAutomaticUpdateDateService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["automaticUpdates"],
      });
      toast.success("تم اضافة الموعد بنجاح");
      close();
    },
    onError: (error: AxiosError<APIError>) => {
      toast.error(error.response?.data.message || "حدث خطأ ما");
    },
  });

  const handleSubmit = (
    values: z.infer<typeof orderStatusAutomaticUpdateCreateSchema>
  ) => {
    createDate({
      checkAfter: values.checkAfter,
      branchID: Number(branchId),
      updateAt: values.updateAt,
      notes: values.notes,
      orderStatus:
        values.orderStatus as CreateAutomaticUpdateDatePayload["orderStatus"],
      newOrderStatus:
        values.newOrderStatus as CreateAutomaticUpdateDatePayload["orderStatus"],
      returnCondition:
        values.returnCondition === "UNKNOWN"
          ? undefined
          : (values.returnCondition as CreateAutomaticUpdateDatePayload["returnCondition"]),
    });
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="اضافة موعد تحديث الطلبات"
        centered>
        <form className="space-y-4" onSubmit={form.onSubmit(handleSubmit)}>
          <Select
            data={orderStatusArray}
            label="اختر حالة الطلب"
            placeholder="اختر حالة الطلب"
            clearable
            searchable
            {...form.getInputProps("orderStatus")}
          />
          {form.values.orderStatus === "POSTPONED" ? (
            <Select
              data={[
                { value: "مؤجل غدا", label: "مؤجل غدا" },
                { value: "مؤجل ليلا", label: "مؤجل ليلا" },
                { value: "مؤجل قضاء", label: "مؤجل قضاء" },
              ]}
              description="اختر وقت التأجيل"
              disabled={!form.values.orderStatus}
              label="اختر وقت التأجيل"
              placeholder="اختر وقت التأجيل"
              clearable
              searchable
              {...form.getInputProps("notes")}
            />
          ) : null}
          {form.values.orderStatus === "PROCESSING" ? (
            <Select
              data={[
                { value: "لا يرد مع رسالة", label: "لا يرد مع رسالة" },
                { value: "مغلق", label: "مغلق" },
                { value: "نقص رقم", label: "نقص رقم" },
                { value: "لا يمكن الاتصال به", label: "لا يمكن الاتصال به" },
                { value: "زيادة رقم", label: "زيادة رقم" },
                { value: "الرقم غير معرف", label: "الرقم غير معرف" },
                { value: "غير داخل بالخدمة", label: "غير داخل بالخدمة" },
                { value: "لم يطلب", label: "لم يطلب" },
                { value: "تعديل سعر", label: "تعديل سعر" },
              ]}
              description="اختر سبب المعالجه"
              disabled={!form.values.orderStatus}
              label="اختر سبب المعالجه"
              placeholder="اختر سبب المعالجه"
              clearable
              searchable
              {...form.getInputProps("notes")}
            />
          ) : null}
          {form.values.orderStatus === "RETURNED" ? (
            <Select
              data={[
                {
                  value: "لا يرد بعد المعالجة",
                  label: "لا يرد بعد المعالجة",
                },
                { value: "رفض الطلب", label: "رفض الطلب" },
                { value: "حظر المندوب", label: "حظر المندوب" },
                { value: "مسافر", label: "مسافر" },
                { value: "تالف", label: "تالف" },
                { value: "تم الوصول والرفض", label: "تم الوصول والرفض" },
                { value: "خطأ بالعنوان", label: "خطأ بالعنوان" },
                { value: "مستلم مسبقاً", label: "مستلم مسبقاً" },
                { value: "خطأ بالتجهيز", label: "خطأ بالتجهيز" },
                { value: "إلغاء الحجز", label: "إلغاء الحجز" },
                { value: "لم يعالج الطلب", label: "لم يعالج الطلب" },
                { value: "كاذب", label: "كاذب" },
                { value: "مكرر", label: "مكرر" },
              ]}
              description="اختر سبب المرتجع"
              disabled={!form.values.orderStatus}
              label="اختر سبب المرتجع"
              placeholder="اختر سبب المرتجع"
              clearable
              searchable
              {...form.getInputProps("notes")}
            />
          ) : null}
          <Select
            data={orderStatusArray.filter(
              (item) => item.value !== form.values.orderStatus
            )}
            description="يجب اختيار حالة الطلب اولاً"
            disabled={!form.values.orderStatus}
            label="اختر حالة الطلب الجديدة"
            placeholder="اختر حالة الطلب الجديدة"
            clearable
            searchable
            {...form.getInputProps("newOrderStatus")}
          />

          <NumberInput
            label="تحديث الطلب بعد مرور(بالساعة)"
            placeholder="تحديث الطلب بعد مرور (بالساعة)"
            allowNegative={false}
            allowDecimal={false}
            {...form.getInputProps("checkAfter")}
          />
          <NumberInput
            label="تحديث يوميا علي الساعة "
            placeholder="تحديث يوميا علي الساعة (24 ساعة)"
            allowNegative={false}
            allowDecimal={false}
            clampBehavior="strict"
            max={24}
            {...form.getInputProps("updateAt")}
          />
          <Radio.Group
            name="orderReturnCondition"
            label="اختر حالة الارجاع"
            withAsterisk
            {...form.getInputProps("returnCondition")}>
            <div className="flex items-center gap-4">
              {orderReturnConditionArray.map((item) => (
                <Radio key={item.value} value={item.value} label={item.label} />
              ))}
              <Radio value="UNKNOWN" label="غير محدد" />
            </div>
          </Radio.Group>
          <div className="flex items-center gap-4">
            <Button loading={isLoading} disabled={isLoading} type="submit">
              اضافة
            </Button>
            <Button type="reset" onClick={close} variant="outline">
              الغاء
            </Button>
          </div>
        </form>
      </Modal>

      <Button onClick={open}>اضافة موعد تحديث الطلبات</Button>
    </>
  );
};
