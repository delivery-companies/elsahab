import { useLocations } from "@/hooks/useLocations";
import { useProducts } from "@/hooks/useProducts";
import { formatMobileNumber } from "@/lib/formateMobileNumber";
import { getSelectOptions } from "@/lib/getSelectOptions";
import { governorateArray } from "@/lib/governorateArabicNames ";
import type { Store } from "@/services/getStores";
import {
  ActionIcon,
  Chip,
  Fieldset,
  Grid,
  Group,
  MultiSelect,
  NumberInput,
  Select,
  Switch,
  TextInput,
  Textarea,
  rem,
} from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { randomId } from "@mantine/hooks";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import type { OrderBulkFormValues } from "..";
import { useAuth } from "@/store/authStore";
// import { useAuth } from "@/store/authStore";

interface BulkOrdersItemProps {
  active: boolean;
  onKeyUp: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  index: number;
  form: UseFormReturnType<OrderBulkFormValues>;
  handleDeleteOrder: (index: number) => void;
  storesData: Store[];
  createBulkOrdersBy: string | null;
  selectedGovernorate?: string | null;
}

export const BulkOrdersItem = ({
  form,
  active,
  onKeyUp,
  handleDeleteOrder,
  index,
  createBulkOrdersBy,
}: BulkOrdersItemProps) => {
  const { role } = useAuth();
  const selectRef = useRef<HTMLInputElement>(null);
  const totalCostRef = useRef<HTMLInputElement>(null);
  const {
    data: productsData = {
      data: [],
    },
  } = useProducts({ size: 100000, minified: true });

  const currentFormValues = form.values.orders[index];

  const {
    data: locationsData = {
      data: [],
    },
  } = useLocations({
    size: 100000,
    minified: true,
  });

  const numberFields = form.values.orders[index].recipientPhones.map(
    (
      phone: {
        phone: string;
        key: string;
      },
      phoneArrayIndex: number
    ) => {
      return (
        <Group style={{ width: rem(280) }} key={phone.key}>
          <TextInput
            onKeyUp={onKeyUp}
            onKeyDown={onKeyUp}
            key={phone.key}
            label={`رقم المستلم ${phoneArrayIndex + 1}`}
            placeholder=""
            size="xs"
            type="text"
            withAsterisk
            style={{ flex: 1 }}
            {...form.getInputProps(
              `orders.${index}.recipientPhones.${phoneArrayIndex}.phone`
            )}
            value={formatMobileNumber(phone.phone)}
            maxLength={11}
          />
          <ActionIcon
            color="red"
            onClick={() => {
              if (form.values.orders[index].recipientPhones.length > 1) {
                form.removeListItem(
                  `orders.${index}.recipientPhones`,
                  phoneArrayIndex
                );
              }
            }}
            className="mt-6">
            <IconTrash size="1rem" />
          </ActionIcon>
          <ActionIcon
            color="red"
            onClick={() => {
              form.insertListItem(`orders.${index}.recipientPhones`, {
                phone: "",
                key: randomId(),
              });
            }}
            className="mt-6">
            <IconPlus size="1rem" />
          </ActionIcon>
        </Group>
      );
    }
  );

  const productsOptions = productsData.data.map((product) => ({
    value: product.id.toString(),
    label: product.title,
  }));

  const getSelectedProductColors = (productID: string) => {
    const product = productsData.data.find(
      (product) => product.id.toString() === productID
    );
    if (product) {
      return product.productColors
        .filter((productColor) => productColor.quantity > 0)
        .map((productColor) => ({
          value: productColor.color.id.toString(),
          label: productColor.color.title,
        }));
    }
    return [];
  };

  const getSelectedProductSizes = (productID: string) => {
    const product = productsData.data.find(
      (product) => product.id.toString() === productID
    );
    if (product) {
      return product.productSizes
        .filter((productSize) => productSize.quantity > 0)
        .map((productSize) => ({
          value: productSize.size.id.toString(),
          label: productSize.size.title,
        }));
    }
    return [];
  };

  const hasProducts = form.values.orders[index].withProducts;

  const productsItems = form.values.orders[index]?.products?.map(
    (product, productsIndex) => {
      return (
        <div
          key={product.productID}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 border-primary/60 rounded px-4 py-2 border-4 mb-4">
          <TextInput
            label="الاسم"
            placeholder=""
            size="xs"
            className="w-full"
            {...form.getInputProps(
              `orders.${index}.products.${productsIndex}.label`
            )}
            disabled
          />
          <TextInput
            label="الكمية"
            placeholder=""
            type="number"
            size="xs"
            className="w-full"
            {...form.getInputProps(
              `orders.${index}.products.${productsIndex}.quantity`
            )}
          />
          <Select
            searchable
            size="xs"
            clearable
            label="اللون"
            placeholder="اختار اللون"
            data={getSelectedProductColors(product.productID)}
            limit={100}
            {...form.getInputProps(
              `orders.${index}.products.${productsIndex}.colorID`
            )}
          />
          <Select
            searchable
            size="xs"
            clearable
            label="المقاس"
            placeholder="اختار المقاس"
            data={getSelectedProductSizes(product.productID)}
            limit={100}
            {...form.getInputProps(
              `orders.${index}.products.${productsIndex}.sizeID`
            )}
          />
        </div>
      );
    }
  );
  const orderProducts = form.values.orders[index].products;

  useEffect(() => {
    if (createBulkOrdersBy === "page" && active) {
      totalCostRef.current?.focus();
    } else if (createBulkOrdersBy === "governorate" && active) {
      selectRef.current?.focus();
    }
  }, [active, createBulkOrdersBy]);

  return (
    <Fieldset
      legend={
        <Chip variant="outline" color="blue" checked>
          {`الطلب رقم ${index + 1}`}
        </Chip>
      }
      className="relative mt-5">
      <ActionIcon
        style={{
          position: "absolute",
          left: "1rem",
          top: "-1.5rem",
        }}
        variant="filled"
        color="red"
        onClick={() => handleDeleteOrder(index)}>
        <X />
      </ActionIcon>
      <div className="flex items-center gap-4">
        <Switch
          className="mt-8 mb-3"
          label="مع منتجات"
          {...form.getInputProps(`orders.${index}.withProducts`)}
        />
      </div>
      <Grid grow gutter="lg">
        {createBulkOrdersBy !== "page" && (
          <Grid.Col span={{ base: 12, md: 6, lg: 2, xl: 2, sm: 12, xs: 12 }}>
            <Select
              ref={selectRef}
              data={governorateArray}
              label="المحافظة"
              searchable
              placeholder="اختر المحافظة"
              size="xs"
              limit={100}
              {...form.getInputProps(`orders.${index}.governorate`)}
              onChange={(value) => {
                form.setFieldValue(`orders.${index}.locationID`, "");
                form.setFieldValue(`orders.${index}.governorate`, value);
              }}
            />
          </Grid.Col>
        )}
        {!hasProducts && (
          <Grid.Col
            span={{ base: 12, md: 6, lg: 1.5, xl: 1.5, sm: 12, xs: 12 }}>
            <NumberInput
              ref={totalCostRef}
              label="مبلغ الوصل "
              placeholder="بدون مبلغ"
              thousandSeparator=","
              size="xs"
              required
              className="w-full"
              {...form.getInputProps(`orders.${index}.totalCost`)}
            />
          </Grid.Col>
        )}
        {role !== "CLIENT" && role !== "CLIENT_ASSISTANT" ? (
          <Grid.Col
            span={{ base: 12, md: 6, lg: 1.5, xl: 1.5, sm: 12, xs: 12 }}>
            <TextInput
              label="رقم الوصل"
              placeholder=""
              size="xs"
              //   allowNegative={false}
              className="w-full"
              {...form.getInputProps(`orders.${index}.receiptNumber`)}
            />
          </Grid.Col>
        ) : null}
        <Grid.Col span={{ base: 12, md: 6, lg: 2, xl: 2, sm: 12, xs: 12 }}>
          <Select
            key={currentFormValues.governorate}
            searchable
            size="xs"
            clearable
            label="المنطقة"
            limit={100}
            placeholder="اختار المنطقة"
            disabled={
              (createBulkOrdersBy === "governorate" &&
                !form.getInputProps(`orders.${index}.governorate`).value) ||
              (createBulkOrdersBy === "page" && !currentFormValues.governorate)
            }
            data={getSelectOptions(
              locationsData.data.filter(
                (l) =>
                  l.governorate ===
                  form.getInputProps(`orders.${index}.governorate`).value
              )
            )}
            {...form.getInputProps(`orders.${index}.locationID`)}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 2, xl: 2, sm: 12, xs: 12 }}>
          <Textarea
            label="تفاصيل اكثر عن العنوان"
            {...form.getInputProps(`orders.${index}.recipientAddress`)}
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
            {...form.getInputProps(`orders.${index}.notes`)}
            autosize
            size="xs"
            minRows={2}
            maxRows={4}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 2, xl: 2, sm: 12, xs: 12 }}>
          <Textarea
            label="تفاصيل الطلب"
            {...form.getInputProps(`orders.${index}.details`)}
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
            {...form.getInputProps(`orders.${index}.recipientName`)}
          />
        </Grid.Col>
        {!hasProducts && (
          <>
            <Grid.Col span={{ base: 12, md: 6, lg: 2, xl: 2, sm: 12, xs: 12 }}>
              <TextInput
                label="عدد القطع"
                type="number"
                placeholder=""
                size="xs"
                className="w-full"
                {...form.getInputProps(`orders.${index}.quantity`)}
              />
            </Grid.Col>
          </>
        )}
        <Grid.Col span={{ base: 12, md: 12, lg: 12, xl: 12, sm: 12, xs: 12 }}>
          {hasProducts && (
            <Grid.Col span={{ base: 12, md: 12, lg: 12, sm: 12, xs: 12 }}>
              <MultiSelect
                searchable
                label="المنتجات"
                size="xs"
                placeholder="اختار المنتجات"
                data={productsOptions}
                limit={100}
                onChange={(selectedProductsIds) => {
                  const productsLabels = selectedProductsIds.map(
                    (productID) => {
                      const isProductAdded = orderProducts?.find(
                        (product) => product.productID === productID
                      );
                      if (isProductAdded) {
                        return isProductAdded;
                      }

                      const product = productsData.data.find(
                        (product) => product.id.toString() === productID
                      );
                      return {
                        label: product?.title,
                        productID,
                        quantity: "1",
                        colorID: "",
                        sizeID: "",
                      };
                    }
                  );

                  form.setFieldValue(
                    `orders.${index}.products`,
                    productsLabels
                  );
                }}
                error={form.errors.products}
              />
              <div className="mt-5">{productsItems}</div>
            </Grid.Col>
          )}
        </Grid.Col>
      </Grid>
    </Fieldset>
  );
};
