import { AppLayout } from "@/components/AppLayout";
import { useBranches } from "@/hooks/useBranches";
import { useColors } from "@/hooks/useColors";
import { useEmployees } from "@/hooks/useEmployees";
import { useLocations } from "@/hooks/useLocations";
import { useOrderDetailsById } from "@/hooks/useOrderDetails";
import { useProducts } from "@/hooks/useProducts";
import { useRepositories } from "@/hooks/useRepositories";
import { useSizes } from "@/hooks/useSizes";
import { useStores } from "@/hooks/useStores";
import { deliveryTypesArray } from "@/lib/deliveryTypesArabicNames";
import { getSelectOptions } from "@/lib/getSelectOptions";
import { governorateArray } from "@/lib/governorateArabicNames ";
import {
  type orderStatusArabicNames,
  orderStatusArray,
} from "@/lib/orderStatusArabicNames";
import type { APIError } from "@/models";
import { type EditOrderPayload, editOrderService } from "@/services/editOrder";
import type { OrderDetails } from "@/services/getOrderDetails";
import {
  ActionIcon,
  Button,
  Grid,
  Group,
  MultiSelect,
  Select,
  Switch,
  TextInput,
  Textarea,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm, zodResolver } from "@mantine/form";
import { randomId } from "@mantine/hooks";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { format, parseISO } from "date-fns";
import "dayjs/locale/ar";
import { ChevronRight } from "lucide-react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import type { z } from "zod";
import { editOrderSchema } from "./schema";

export const EditOrder = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: employeesData } = useEmployees({
    size: 100000,
    minified: true,
    roles: ["DELIVERY_AGENT"],
  });
  const { data: colors = { data: [] } } = useColors({
    size: 100000,
    minified: true,
  });
  const { data: sizes = { data: [] } } = useSizes({
    size: 100000,
    minified: true,
  });
  const {
    data: orderDetails = {
      data: {} as OrderDetails,
    },
    isLoading: isFetchingProduct,
    isError,
  } = useOrderDetailsById(id);

  const form = useForm({
    validate: zodResolver(editOrderSchema),
    initialValues: {
      paidAmount: "",
      discount: "",
      withProducts: false,
      deliveryAgentID: "",
      totalCost: "",
      quantity: "",
      status: "",
      weight: "",
      recipientName: "",
      recipientPhones: [
        {
          key: randomId(),
          number: "",
        },
      ] as unknown as { key: string; number: string }[],
      recipientAddress: "",
      deliveryDate: "",
      notes: "",
      details: "",
      deliveryType: "",
      governorate: "",
      locationID: "",
      storeID: "",
      products: [] as unknown as {
        productID: string;
        quantity: string;
        colorID: string;
        sizeID: string;
      }[],
      repositoryID: "",
      branchID: "",
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (orderDetails?.data) {
      form.setValues({
        paidAmount: orderDetails?.data?.paidAmount?.toString(),
        discount: orderDetails?.data?.discount?.toString(),
        status: orderDetails?.data?.status,
        deliveryAgentID:
          orderDetails?.data?.deliveryAgent?.id.toString() &&
          (orderDetails?.data?.deliveryAgent.id.toString() || ""),
        withProducts: orderDetails.data.orderProducts?.length > 0,
        deliveryDate: orderDetails?.data?.deliveryDate || "",
        totalCost: orderDetails?.data?.totalCost?.toString(),
        quantity: orderDetails?.data?.quantity?.toString(),
        weight: orderDetails?.data?.weight?.toString(),
        recipientName: orderDetails?.data?.recipientName,
        recipientPhones:
          orderDetails?.data?.recipientPhones?.length > 0
            ? orderDetails?.data?.recipientPhones?.map((phone) => ({
                key: randomId(),
                number: phone,
              }))
            : [
                {
                  key: randomId(),
                  number: "",
                },
              ],
        recipientAddress: orderDetails?.data?.recipientAddress,
        notes: orderDetails?.data?.notes || "",
        details: orderDetails?.data?.details || "",
        deliveryType: orderDetails?.data?.deliveryType,
        governorate: orderDetails?.data?.governorate,
        locationID: orderDetails?.data?.location?.id.toString(),
        storeID: orderDetails?.data?.store?.id.toString(),
        products: orderDetails?.data?.orderProducts?.map((product) => ({
          label: product.product?.title,
          productID: product.product?.id.toString(),
          quantity: product.quantity?.toString(),
          colorID: product?.color?.id.toString(),
          sizeID: product?.size?.id.toString(),
        })),
        repositoryID: orderDetails?.data?.repository?.id.toString(),
        branchID: orderDetails?.data?.branch?.id.toString(),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderDetails]);

  const {
    data: locationsData = {
      data: [],
    },
  } = useLocations({ size: 100000, minified: true });

  const { data: repositories } = useRepositories({
    size: 100000,
    minified: true,
  });
  const { data: branches } = useBranches({
    size: 100000,
    minified: true,
  });

  const {
    data: storesData = {
      data: [],
    },
  } = useStores({ size: 100000, minified: true });

  const { mutate: editOrder, isLoading } = useMutation({
    mutationFn: (data: EditOrderPayload) => {
      return editOrderService({
        id: orderDetails.data.id,
        data,
      });
    },
    onSuccess: () => {
      toast.success("تم تعديل الطلب بنجاح");
      // navigate("/orders");
      // form.reset();
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
      queryClient.invalidateQueries({
        queryKey: ["timeline"],
      });
    },
    onError: (error: AxiosError<APIError>) => {
      toast.error(error.response?.data.message || "حدث خطأ ما");
    },
  });

  const {
    data: productsData = {
      data: [],
    },
  } = useProducts({ size: 100000, minified: true });

  const handleEditOrder = (values: z.infer<typeof editOrderSchema>) => {
    editOrder({
      deliveryAgentID: values.deliveryAgentID
        ? Number(values.deliveryAgentID)
        : undefined,
      deliveryDate: values.deliveryDate || undefined,
      details: values.details || "",
      discount: Number.parseInt(values.discount),
      notes: values.notes || "",
      paidAmount: Number.parseInt(values.paidAmount),
      recipientAddress: values.recipientAddress,
      recipientName: values.recipientName,
      recipientPhones: values.recipientPhones.map((phone) => phone.number),
      status: values.status as keyof typeof orderStatusArabicNames,
      branchID: Number(values.branchID) || undefined,
      repositoryID: Number(values.repositoryID) || undefined,
      quantity: Number(values.quantity) || 1,
      weight: Number(values.weight) || 1,
      governorate: values.governorate,
      locationID: +values.locationID!!,
    });
  };

  const hasProducts = form.values.withProducts;
  const productsOptions = productsData.data?.map((product) => ({
    value: product.id.toString(),
    label: product.title,
  }));

  const colorsOptions = colors.data?.map((color) => ({
    value: color.id.toString(),
    label: color.title,
  }));
  const sizesOptions = sizes.data?.map((size) => ({
    value: size.id.toString(),
    label: size.title,
  }));

  const productsItems = form.values.products?.map((product, index) => {
    return (
      <div
        key={product.productID}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 border-primary/60 rounded px-4 py-2 border-4 mb-4">
        <TextInput
          label="الاسم"
          placeholder=""
          size="md"
          className="w-full"
          {...form.getInputProps(`products.${index}.label`)}
          disabled
        />
        <TextInput
          label="الكمية"
          placeholder=""
          type="number"
          size="md"
          className="w-full"
          {...form.getInputProps(`products.${index}.quantity`)}
          disabled
        />
        <Select
          searchable
          label="اللون"
          placeholder="اختار اللون"
          data={colorsOptions}
          limit={100}
          {...form.getInputProps(`products.${index}.colorID`)}
          disabled
        />
        <Select
          searchable
          label="المقاس"
          placeholder="اختار المقاس"
          data={sizesOptions}
          limit={100}
          {...form.getInputProps(`products.${index}.sizeID`)}
          disabled
        />
      </div>
    );
  });

  const convertDateFormat = (date: Date | null): string | null => {
    if (date) {
      const parsedDate = parseISO(date.toISOString());
      return format(parsedDate, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
    }
    return null;
  };

  const numberFields = form.values.recipientPhones?.map((phone, index) => (
    <Group key={phone.key}>
      <TextInput
        label={`رقم المستلم ${index + 1}`}
        placeholder=""
        size="md"
        withAsterisk
        style={{ flex: 1 }}
        {...form.getInputProps(`recipientPhones.${index}.number`)}
      />
      <ActionIcon
        color="red"
        onClick={() => {
          if (index !== 0) {
            form.removeListItem("recipientPhones", index);
          }
        }}
        className="mt-6">
        <IconTrash size="1rem" />
      </ActionIcon>
      <ActionIcon
        color="red"
        onClick={() => {
          form.insertListItem("recipientPhones", {
            number: "",
            key: randomId(),
          });
        }}
        className="mt-6">
        <IconPlus size="1rem" />
      </ActionIcon>
    </Group>
  ));

  return (
    <AppLayout isLoading={isFetchingProduct} isError={isError}>
      <div className="flex items-center gap-4">
        <ChevronRight
          size={34}
          className="mt-2 cursor-pointer"
          onClick={() => {
            navigate("/orders");
          }}
        />
        <h1 className="text-3xl font-semibold">تعديل طلب</h1>
      </div>
      <form onSubmit={form.onSubmit(handleEditOrder)}>
        <Switch
          className="mt-8 mb-3"
          label="مع منتجات"
          disabled
          checked={form.values.withProducts}
          onChange={(event) => {
            form.setFieldValue("withProducts", event.currentTarget.checked);
          }}
        />
        <Grid gutter="lg">
          {!hasProducts && (
            <>
              <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                <TextInput
                  label="اجمالي التكلفة"
                  placeholder=""
                  type="number"
                  disabled
                  size="md"
                  className="w-full"
                  {...form.getInputProps("totalCost")}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                <TextInput
                  label="الكمية"
                  type="number"
                  placeholder=""
                  size="md"
                  className="w-full"
                  {...form.getInputProps("quantity")}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                <TextInput
                  label="الوزن"
                  type="number"
                  placeholder=""
                  size="md"
                  className="w-full"
                  {...form.getInputProps("weight")}
                />
              </Grid.Col>
            </>
          )}
          <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
            <TextInput
              label="المبلغ المدفوع"
              placeholder=""
              type="number"
              size="md"
              className="w-full"
              {...form.getInputProps("paidAmount")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
            <Select
              label="حالة الطلب"
              size="md"
              className="w-full"
              data={orderStatusArray}
              {...form.getInputProps("status")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
            <Select
              label="المخزن"
              size="md"
              disabled
              className="w-full"
              data={getSelectOptions(repositories?.data || [])}
              {...form.getInputProps("repositoryID")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
            <Select
              label="الفرع"
              size="md"
              disabled
              className="w-full"
              data={getSelectOptions(branches?.data || [])}
              {...form.getInputProps("branchID")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
            <Select
              label="مندوب التوصيل"
              size="md"
              className="w-full"
              data={getSelectOptions(employeesData?.data || [])}
              limit={100}
              {...form.getInputProps("deliveryAgentID")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
            <div className="flex flex-col items-center">
              <p>تاريخ التوصيل</p>
              <DatePicker
                className="border-4 rounded-lg border-primary/60 "
                locale="ar"
                value={
                  form.values.deliveryDate
                    ? new Date(form.values.deliveryDate || "")
                    : undefined
                }
                onChange={(date) => {
                  const newDeliveryDate = convertDateFormat(date);
                  form.setFieldValue("deliveryDate", newDeliveryDate || "");
                }}
              />
              {form.errors.deliveryDate && (
                <p className="text-red-500">{form.errors.deliveryDate}</p>
              )}
              {form.values.deliveryDate && (
                <Button
                  onClick={() => {
                    form.setFieldValue("deliveryDate", "");
                  }}
                  fullWidth
                  className="mt-3"
                  variant="outline">
                  الحذف
                </Button>
              )}
            </div>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
            <TextInput
              label="الخصم"
              placeholder=""
              type="number"
              size="md"
              className="w-full"
              {...form.getInputProps("discount")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
            <TextInput
              label="اسم المستلم"
              placeholder=""
              size="md"
              className="w-full"
              {...form.getInputProps("recipientName")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
            {numberFields}
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
            <TextInput
              label="العنوان"
              placeholder=""
              size="md"
              className="w-full"
              {...form.getInputProps("recipientAddress")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
            <Select
              searchable
              label="المتجر"
              placeholder="اختار المتجر"
              disabled
              data={getSelectOptions(storesData.data)}
              limit={100}
              {...form.getInputProps("storeID")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
            <Select
              searchable
              label="المحافظة"
              placeholder="اختار المحافظة"
              data={governorateArray}
              {...form.getInputProps("governorate")}
              onChange={(e) => {
                form.setValues({
                  governorate: e || undefined,
                  locationID: undefined,
                });
              }}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
            <Select
              searchable
              label="المناطق"
              placeholder="اختار المنطقة"
              limit={100}
              data={
                form.getInputProps("governorate").value
                  ? getSelectOptions(
                      locationsData.data.filter(
                        (l) =>
                          l.governorate ===
                          form.getInputProps("governorate").value
                      )
                    )
                  : []
              }
              {...form.getInputProps("locationID")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
            <Select
              searchable
              label="نوع التوصيل"
              placeholder="اختار نوع التوصيل"
              data={deliveryTypesArray}
              {...form.getInputProps("deliveryType")}
            />
          </Grid.Col>

          {hasProducts && (
            <Grid.Col span={{ base: 12, md: 12, lg: 12, sm: 12, xs: 12 }}>
              <MultiSelect
                // {...form.getInputProps('products')}
                searchable
                disabled
                label="المنتجات"
                placeholder="اختار المنتجات"
                value={form.values.products.map((product) => product.productID)}
                data={productsOptions}
                onChange={(selectedProductsIds) => {
                  const productsLabels = selectedProductsIds.map(
                    (productID) => {
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
                  form.setFieldValue("products", productsLabels);
                }}
                error={form.errors.products}
              />
              <div className="mt-5">{productsItems}</div>
            </Grid.Col>
          )}
          <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
            <Textarea
              label="الملاحظات"
              {...form.getInputProps("notes")}
              rows={7}
              maxRows={10}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
            <Textarea
              label="التفاصيل"
              {...form.getInputProps("details")}
              rows={7}
              maxRows={10}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
            <Button
              loading={isLoading}
              disabled={isLoading}
              type="submit"
              fullWidth
              mt="xl"
              size="md">
              تعديل
            </Button>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
            <Button
              type="reset"
              fullWidth
              mt="xl"
              size="md"
              variant="outline"
              onClick={() => {
                navigate("/orders");
              }}>
              الغاء
            </Button>
          </Grid.Col>
        </Grid>
      </form>
    </AppLayout>
  );
};
