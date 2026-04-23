import { AppLayout } from "@/components/AppLayout";
import { useBranches } from "@/hooks/useBranches";
import { useLocations } from "@/hooks/useLocations";
import { useProducts } from "@/hooks/useProducts";
import { useStores } from "@/hooks/useStores";
import { deliveryTypesArray } from "@/lib/deliveryTypesArabicNames";
import { getSelectOptions } from "@/lib/getSelectOptions";
import { type governorateArabicNames, governorateArray } from "@/lib/governorateArabicNames ";
import type { APIError } from "@/models";
import { type CreateOrderPayload, createOrderService } from "@/services/createOrder";
import {
    ActionIcon,
    Button,
    Grid,
    Group,
    MultiSelect,
    NumberInput,
    Select,
    Switch,
    TextInput,
    Textarea
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { randomId } from "@mantine/hooks";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import type { z } from "zod";
import { addOrderSchema } from "./schema";

export const AddOrder = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const form = useForm({
        validate: zodResolver(addOrderSchema),
        initialValues: {
            withProducts: false,
            totalCost: 0,
            quantity: "1",
            recipientName: "",
            recipientPhone: [
                {
                    number: "",
                    key: randomId()
                }
            ],
            recipientAddress: "",
            notes: "",
            details: "",
            deliveryType: "",
            governorate: "",
            locationID: "",
            storeID: "",
            branchID: "",
            products: [] as unknown as {
                productID: string;
                quantity: string;
                colorID: string;
                sizeID: string;
            }[]
        }
    });

    const {
        data: locationsData = {
            data: []
        }
    } = useLocations({
        size: 100000,
        minified: true,
        governorate: form.values.governorate as keyof typeof governorateArabicNames
    });
    const {
        data: storesData = {
            data: []
        }
    } = useStores({ size: 100000, minified: true });

    const {
        data: branchesData = {
            data: []
        }
    } = useBranches({
        size: 100000,
        minified: true,
        location_id: Number(form.values.locationID)
    });

    const { mutate: createOrder, isLoading } = useMutation({
        mutationFn: (data: CreateOrderPayload) => {
            return createOrderService(data);
        },
        onSuccess: () => {
            toast.success("تم اضافة الطلب بنجاح");
            queryClient.invalidateQueries({
                queryKey: ["orders"]
            });
            queryClient.invalidateQueries({
                queryKey: ["ordersStatistics"]
            });
            form.reset();
        },
        onError: (error: AxiosError<APIError>) => {
            toast.error(error.response?.data.message || "حدث خطأ ما");
        }
    });

    const {
        data: productsData = {
            data: []
        }
    } = useProducts({ size: 100000, minified: true });

    const handleCreateOrder = (values: z.infer<typeof addOrderSchema>) => {
        if (!values.withProducts) {
            createOrder({
                deliveryType: values.deliveryType,
                details: values.details,
                governorate: values.governorate,
                locationID: Number(values.locationID),
                notes: values.notes,
                branchID: Number(values.branchID),
                quantity: Number.parseInt(values.quantity || ""),
                recipientAddress: values.recipientAddress,
                recipientName: values.recipientName,
                recipientPhones: values.recipientPhone.map((phone) => phone.number),
                storeID: Number(values.storeID),
                totalCost: values.totalCost,
                withProducts: values.withProducts
            });
        } else {
            createOrder({
                deliveryType: values.deliveryType,
                branchID: Number(values.branchID),
                details: values.details,
                governorate: values.governorate,
                locationID: Number(values.locationID),
                notes: values.notes,
                products: values.products?.map((product) => ({
                    colorID: Number(product.colorID),
                    productID: Number(product.productID),
                    quantity: Number.parseInt(product.quantity),
                    sizeID: Number(product.sizeID)
                })),
                recipientAddress: values.recipientAddress,
                recipientName: values.recipientName,
                recipientPhones: values.recipientPhone.map((phone) => phone.number),
                storeID: Number(values.storeID),
                withProducts: values.withProducts
            });
        }
    };

    const hasProducts = form.values.withProducts;
    const productsOptions = productsData.data.map((product) => ({
        value: product.id.toString(),
        label: product.title
    }));

    const numberFields = form.values.recipientPhone.map((phone, index) => (
        <Group key={phone.key}>
            <TextInput
                label={`رقم المستلم ${index + 1}`}
                placeholder=""
                size="sm"
                withAsterisk
                style={{ flex: 1 }}
                {...form.getInputProps(`recipientPhone.${index}.number`)}
            />
            <ActionIcon
                color="red"
                onClick={() => {
                    if (index !== 0) {
                        form.removeListItem("recipientPhone", index);
                    }
                }}
                className="mt-6"
            >
                <IconTrash size="1rem" />
            </ActionIcon>
            <ActionIcon
                color="red"
                onClick={() => {
                    form.insertListItem("recipientPhone", {
                        number: "",
                        key: randomId()
                    });
                }}
                className="mt-6"
            >
                <IconPlus size="1rem" />
            </ActionIcon>
        </Group>
    ));

    const getSelectedProductColors = (productID: string) => {
        const product = productsData.data.find((product) => product.id.toString() === productID);
        if (product) {
            return product.productColors
                .filter((productColor) => productColor.quantity > 0)
                .map((productColor) => ({
                    value: productColor.color.id.toString(),
                    label: productColor.color.title
                }));
        }
        return [];
    };

    const getSelectedProductSizes = (productID: string) => {
        const product = productsData.data.find((product) => product.id.toString() === productID);
        if (product) {
            return product.productSizes
                .filter((productSize) => productSize.quantity > 0)
                .map((productSize) => ({
                    value: productSize.size.id.toString(),
                    label: productSize.size.title
                }));
        }
        return [];
    };

    const productsItems = form.values.products.map((product, index) => {
        return (
            <div
                key={product.productID}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 border-primary/60 rounded px-4 py-2 border-4 mb-4"
            >
                <TextInput
                    label="الاسم"
                    placeholder=""
                    size="sm"
                    className="w-full"
                    {...form.getInputProps(`products.${index}.label`)}
                    disabled
                />
                <TextInput
                    label="الكمية"
                    placeholder=""
                    type="number"
                    size="sm"
                    className="w-full"
                    {...form.getInputProps(`products.${index}.quantity`)}
                />
                <Select
                    searchable
                    clearable
                    label="اللون"
                    size="sm"
                    placeholder="اختار اللون"
                    data={getSelectedProductColors(product.productID)}
                    limit={100}
                    {...form.getInputProps(`products.${index}.colorID`)}
                />
                <Select
                    searchable
                    clearable
                    size="sm"
                    label="المقاس"
                    placeholder="اختار المقاس"
                    data={getSelectedProductSizes(product.productID)}
                    limit={100}
                    {...form.getInputProps(`products.${index}.sizeID`)}
                />
            </div>
        );
    });

    const orderProducts = form.values.products;

    return (
        <AppLayout>
            <div className="flex items-center gap-4">
                <ChevronRight
                    size={34}
                    className="mt-2 cursor-pointer"
                    onClick={() => {
                        navigate("/orders");
                    }}
                />
                <h1 className="text-3xl font-semibold">اضافة طلب</h1>
            </div>
            <form onSubmit={form.onSubmit(handleCreateOrder)}>
                <Switch className="mt-8 mb-3" label="مع منتجات" {...form.getInputProps("withProducts")} />
                <Grid gutter="lg">
                    {!hasProducts && (
                        <>
                            <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                                <NumberInput
                                    label="مبلغ الطلب"
                                    placeholder=""
                                    allowNegative={false}
                                    thousandSeparator=","
                                    size="sm"
                                    className="w-full"
                                    {...form.getInputProps("totalCost")}
                                />
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                                <TextInput
                                    label="الكمية"
                                    type="number"
                                    placeholder=""
                                    size="sm"
                                    className="w-full"
                                    {...form.getInputProps("quantity")}
                                />
                            </Grid.Col>
                        </>
                    )}
                    <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                        <TextInput
                            label="اسم الزبون"
                            placeholder=""
                            size="sm"
                            className="w-full"
                            {...form.getInputProps("recipientName")}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>{numberFields}</Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                        <Select
                            searchable
                            size="sm"
                            label="المحافظة"
                            placeholder="اختار المحافظة"
                            limit={100}
                            data={governorateArray}
                            clearable
                            {...form.getInputProps("governorate")}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                        <Select
                            searchable
                            label="المناطق"
                            size="sm"
                            clearable
                            limit={100}
                            placeholder="اختار المنطقة"
                            data={getSelectOptions(locationsData.data)}
                            {...form.getInputProps("locationID")}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                        <Select
                            searchable
                            label="الفرع"
                            size="sm"
                            clearable
                            placeholder="اختار الفرع"
                            limit={100}
                            data={getSelectOptions(branchesData.data)}
                            {...form.getInputProps("branchID")}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                        <TextInput
                            label="العنوان"
                            placeholder=""
                            size="sm"
                            className="w-full"
                            {...form.getInputProps("recipientAddress")}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                        <Select
                            searchable
                            label="المتجر"
                            size="sm"
                            placeholder="اختار المتجر"
                            limit={100}
                            data={getSelectOptions(storesData.data)}
                            {...form.getInputProps("storeID")}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }} />
                    <Grid.Col span={{ base: 12 }}>
                        <Select
                            searchable
                            label="نوع التوصيل"
                            size="sm"
                            limit={100}
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
                                label="المنتجات"
                                placeholder="اختار المنتجات"
                                size="sm"
                                data={productsOptions}
                                limit={100}
                                onChange={(selectedProductsIds) => {
                                    const productsLabels = selectedProductsIds.map((productID) => {
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
                                            sizeID: ""
                                        };
                                    });
                                    form.setFieldValue("products", productsLabels);
                                }}
                                error={form.errors.products}
                            />
                            <div className="mt-5">{productsItems}</div>
                        </Grid.Col>
                    )}
                    <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                        <Textarea
                            autosize
                            minRows={2}
                            maxRows={4}
                            label="الملاحظات"
                            {...form.getInputProps("notes")}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                        <Textarea
                            autosize
                            minRows={2}
                            maxRows={4}
                            label="التفاصيل"
                            {...form.getInputProps("details")}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                        <Button
                            loading={isLoading}
                            disabled={isLoading}
                            type="submit"
                            fullWidth
                            mt="xl"
                            size="md"
                        >
                            اضافة
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
                                form.reset();
                                navigate("/orders");
                            }}
                        >
                            الغاء
                        </Button>
                    </Grid.Col>
                </Grid>
            </form>
        </AppLayout>
    );
};
