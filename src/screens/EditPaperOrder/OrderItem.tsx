import { useLocations } from "@/hooks/useLocations";
import { formatMobileNumber } from "@/lib/formateMobileNumber";
import { getSelectOptions } from "@/lib/getSelectOptions";
import { governorateArray } from "@/lib/governorateArabicNames ";
import {
  ActionIcon,
  Fieldset,
  Grid,
  Group,
  NumberInput,
  Select,
  TextInput,
  Textarea,
  rem,
} from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { randomId } from "@mantine/hooks";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useRef } from "react";
import { CreateBulkOrdersSchema } from "./schema";
import { useStores } from "@/hooks/useStores";
// import { useAuth } from "@/store/authStore";

interface BulkOrdersItemProps {
  form: UseFormReturnType<CreateBulkOrdersSchema>;
}

export const OrderItem = ({ form }: BulkOrdersItemProps) => {
  const totalCostRef = useRef<HTMLInputElement>(null);

  const currentFormValues = form.values;

  const {
    data: locationsData = {
      data: [],
    },
  } = useLocations({
    size: 100000,
    minified: true,
  });

  const numberFields = form.values.recipientPhones.map(
    (
      phone: {
        phone: string;
        key: string;
      },
      phoneArrayIndex: number,
    ) => {
      return (
        <Group style={{ width: rem(280) }} key={phone.key}>
          <TextInput
            key={phone.key}
            label={`رقم المستلم ${phoneArrayIndex + 1}`}
            placeholder=""
            size="xs"
            type="text"
            withAsterisk
            style={{ flex: 1 }}
            {...form.getInputProps(`recipientPhones.${phoneArrayIndex}.phone`)}
            value={phone.phone ? formatMobileNumber(phone.phone) : ""}
            maxLength={11}
          />
          <ActionIcon
            color="red"
            onClick={() => {
              if (form.values.recipientPhones.length > 1) {
                form.removeListItem(`recipientPhones`, phoneArrayIndex);
              }
            }}
            className="mt-6">
            <IconTrash size="1rem" />
          </ActionIcon>
          <ActionIcon
            color="red"
            onClick={() => {
              form.insertListItem(`recipientPhones`, {
                phone: "",
                key: randomId(),
              });
            }}
            className="mt-6">
            <IconPlus size="1rem" />
          </ActionIcon>
        </Group>
      );
    },
  );

  const {
    data: storesData = {
      data: [],
    },
  } = useStores({ size: 100000, minified: true });

  return (
    <Fieldset className="relative mt-5">
      <Grid grow gutter="lg">
        <Grid.Col span={{ base: 12, md: 6, lg: 2, xl: 2, sm: 12, xs: 12 }}>
          <Select
            clearable
            data={getSelectOptions(storesData?.data || [])}
            label="المتجر"
            searchable
            placeholder="اختر المتجر"
            size="xs"
            required
            {...form.getInputProps(`storeID`)}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 2, xl: 2, sm: 12, xs: 12 }}>
          <Select
            data={governorateArray}
            label="المحافظة"
            searchable
            clearable
            placeholder="اختر المحافظة"
            size="xs"
            limit={100}
            {...form.getInputProps(`governorate`)}
            onChange={(value) => {
              form.setFieldValue(`locationID`, "");
              form.setFieldValue(`governorate`, value || "");
            }}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 1.5, xl: 1.5, sm: 12, xs: 12 }}>
          <NumberInput
            ref={totalCostRef}
            label="مبلغ الوصل "
            placeholder="بدون مبلغ"
            thousandSeparator=","
            size="xs"
            required
            className="w-full"
            {...form.getInputProps(`totalCost`)}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 2, xl: 2, sm: 12, xs: 12 }}>
          <Select
            key={currentFormValues.governorate}
            searchable
            size="xs"
            clearable
            label="المنطقة"
            limit={100}
            placeholder="اختار المنطقة"
            disabled={!form.getInputProps(`governorate`).value}
            data={getSelectOptions(
              locationsData.data.filter(
                (l) =>
                  l.governorate === form.getInputProps(`governorate`).value,
              ),
            )}
            {...form.getInputProps(`locationID`)}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 2, xl: 2, sm: 12, xs: 12 }}>
          <Textarea
            label="تفاصيل اكثر عن العنوان"
            {...form.getInputProps(`recipientAddress`)}
            autosize
            size="xs"
            minRows={2}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 2, xl: 2, sm: 12, xs: 12 }}>
          {numberFields}
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 2, xl: 2, sm: 12, xs: 12 }}>
          <Textarea
            label="الملاحظات"
            {...form.getInputProps(`notes`)}
            autosize
            size="xs"
            minRows={2}
            maxRows={4}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 2, xl: 2, sm: 12, xs: 12 }}>
          <Textarea
            label="تفاصيل الطلب"
            {...form.getInputProps(`details`)}
            autosize
            size="xs"
            minRows={2}
            maxRows={4}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 2, xl: 2, sm: 12, xs: 12 }}>
          <TextInput
            label="اسم المستلم"
            placeholder=""
            size="xs"
            className="w-full"
            {...form.getInputProps(`recipientName`)}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6, lg: 2, xl: 2, sm: 12, xs: 12 }}>
          <TextInput
            label="عدد القطع"
            type="number"
            placeholder=""
            size="xs"
            className="w-full"
            {...form.getInputProps(`quantity`)}
          />
        </Grid.Col>
      </Grid>
    </Fieldset>
  );
};
