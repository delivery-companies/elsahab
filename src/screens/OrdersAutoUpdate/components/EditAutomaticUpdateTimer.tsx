import { useEditAutomaticUpdateTimer } from "@/hooks/useEditAutomaticUpdateTimer";
import { orderReturnConditionArray } from "@/lib/orderReturnConditionArabicNames";
import { orderStatusArray } from "@/lib/orderStatusArabicNames";
import type { CreateAutomaticUpdateDatePayload } from "@/services/createAutomaticUpdateDate";
import type { AutomaticUpdate } from "@/services/getAutomaticUpdates";
import {
  ActionIcon,
  Button,
  Modal,
  NumberInput,
  Radio,
  Select,
  Switch,
  rem,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconPencil } from "@tabler/icons-react";
import type { z } from "zod";
import { orderStatusAutomaticUpdateCreateSchema } from "./AddAutomaticUpdateTimer.zod";

export const EditAutomaticUpdateTimer = ({
  branch,
  enabled,
  governorate,
  id,
  newOrderStatus,
  orderStatus,
  checkAfter,
  updateAt,
  returnCondition,
  notes,
}: AutomaticUpdate) => {
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm({
    validate: zodResolver(orderStatusAutomaticUpdateCreateSchema),
    initialValues: {
      governorate,
      orderStatus,
      newOrderStatus,
      checkAfter,
      branchID: String(branch.id),
      enabled,
      updateAt: Number(updateAt),
      returnCondition: returnCondition || "UNKNOWN",
      notes,
    },
  });

  const { mutate: editDate, isLoading } = useEditAutomaticUpdateTimer();

  const handleSubmit = (
    values: z.infer<typeof orderStatusAutomaticUpdateCreateSchema>
  ) => {
    editDate(
      {
        id,
        data: {
          checkAfter: values.checkAfter,
          branchID: Number(branch.id),
          orderStatus:
            values.orderStatus as CreateAutomaticUpdateDatePayload["orderStatus"],
          newOrderStatus:
            values.newOrderStatus as CreateAutomaticUpdateDatePayload["orderStatus"],
          updateAt: values.updateAt,
          enabled: values.enabled,
          returnCondition:
            values.returnCondition === "UNKNOWN"
              ? undefined
              : (values.returnCondition as CreateAutomaticUpdateDatePayload["returnCondition"]),
          notes:
            values.orderStatus === "POSTPONED" ||
            values.orderStatus === "RETURNED" ||
            values.orderStatus === "PROCESSING"
              ? values.notes
              : "",
        },
      },
      {
        onSuccess: () => {
          close();
        },
      }
    );
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="تعديل موعد تحديث الطلبات"
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
            label="تحديث الطلب بعد مرور (بالساعة)"
            placeholder="تحديث الطلب بعد مرور (بالساعة)"
            allowNegative={false}
            allowDecimal={false}
            {...form.getInputProps("checkAfter")}
          />
          <NumberInput
            label="(24 ساعة) تحديث يوميا علي الساعة "
            placeholder="تحديث يوميا علي الساعة (24 ساعة)"
            allowNegative={false}
            allowDecimal={false}
            clampBehavior="strict"
            max={24}
            {...form.getInputProps("updateAt")}
          />
          <Switch
            label="تفعيل"
            {...form.getInputProps("enabled")}
            defaultChecked={enabled}
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
              تعديل
            </Button>
            <Button type="reset" onClick={close} variant="outline">
              الغاء
            </Button>
          </div>
        </form>
      </Modal>

      <ActionIcon
        onClick={() => {
          open();
        }}
        variant="filled">
        <IconPencil style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
      </ActionIcon>
    </>
  );
};
