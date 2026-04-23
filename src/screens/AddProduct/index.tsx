import { AppLayout } from "@/components/AppLayout";
import { ImageUploader } from "@/components/CustomDropZone";
import { useCategory } from "@/hooks/useCategory";
import { useColors } from "@/hooks/useColors";
import { useSizes } from "@/hooks/useSizes";
import { useStores } from "@/hooks/useStores";
import type { APIError } from "@/models";
import { createProductService } from "@/services/createProduct";
import { Badge, Button, Grid, Select, TextInput } from "@mantine/core";
import type { FileWithPath } from "@mantine/dropzone";
import { useForm, zodResolver } from "@mantine/form";
import { IconX } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import type { z } from "zod";
import { addProductSchema } from "./schema";

export const AddProduct = () => {
    const navigate = useNavigate();
    const {
        data: categories = {
            data: []
        }
    } = useCategory({ size: 100000, minified: true });
    const { data: colors = { data: [] } } = useColors({
        size: 100000,
        minified: true
    });
    const { data: sizes = { data: [] } } = useSizes({
        size: 100000,
        minified: true
    });
    const { data: storesData } = useStores({
        size: 100000,
        minified: true
    });
    const colorsOptions = colors.data.map((color) => ({
        value: color.id.toString(),
        label: color.title
    }));
    const sizesOptions = sizes.data.map((size) => ({
        value: size.id.toString(),
        label: size.title
    }));
    const categoriesOptions = categories.data.map((category) => ({
        value: category.id.toString(),
        label: category.title
    }));
    const storesOptions = storesData?.data.map((product) => ({
        value: product.id.toString(),
        label: product.name
    }));
    const form = useForm({
        validate: zodResolver(addProductSchema),
        initialValues: {
            title: "",
            price: "",
            image: [] as unknown as FileWithPath[],
            stock: "",
            categoryID: "",
            colors: [] as unknown as { label: string; value: string; quantity: "" }[],
            sizes: [] as unknown as { label: string; value: string; quantity: "" }[],
            storeID: ""
        }
    });

    const productColors = form.values.colors.map((color, index) => {
        return (
            <div key={color.value} className="relative">
                <TextInput
                    type="number"
                    label={
                        <div className="mb-2">
                            <Badge color={color.label}>{color.label}</Badge>
                        </div>
                    }
                    placeholder="الكمية"
                    {...form.getInputProps(`colors.${index}.quantity`)}
                />
                <IconX
                    size={20}
                    className="absolute top-0 left-0 cursor-pointer  text-primary border-primary border-2 rounded-full"
                    onClick={() => {
                        form.removeListItem("colors", index);
                    }}
                />
            </div>
        );
    });

    const productSizes = form.values.sizes.map((size, index) => {
        return (
            <div key={size.value} className="relative">
                <TextInput
                    type="number"
                    key={size.value}
                    label={`الحجم ${size.label}`}
                    placeholder="الكمية"
                    {...form.getInputProps(`sizes.${index}.quantity`)}
                />
                <IconX
                    size={20}
                    className="absolute top-0 left-0 cursor-pointer  text-primary border-primary border-2 rounded-full"
                    onClick={() => {
                        form.removeListItem("sizes", index);
                    }}
                />
            </div>
        );
    });
    const queryClient = useQueryClient();
    const { mutate: createProductAction, isLoading } = useMutation({
        mutationFn: (data: FormData) => {
            return createProductService(data);
        },
        onSuccess: () => {
            toast.success("تم اضافة المنتج بنجاح");
            queryClient.invalidateQueries({
                queryKey: ["products"]
            });
            navigate("/home");
        },
        onError: (error: AxiosError<APIError>) => {
            toast.error(error.response?.data.message || "حدث خطأ ما");
        }
    });

    const handleSubmit = (values: z.infer<typeof addProductSchema>) => {
        const everyColorHasQuantity = values.colors.every((color) => color.quantity !== "");
        const everySizeHasQuantity = values.sizes.every((size) => size.quantity !== "");
        if (!everyColorHasQuantity) {
            form.setFieldError("colors", "يجب اضافة الكمية المتاحة");
            return;
        }
        if (!everySizeHasQuantity) {
            form.setFieldError("sizes", "يجب اضافة الكمية المتاحة");
            return;
        }
        const transformedColors = values.colors.map((color) => ({
            colorID: color.value,
            quantity: Number(color.quantity)
        }));
        const transformedSizes = values.sizes.map((size) => ({
            sizeID: size.value,
            quantity: Number(size.quantity)
        }));
        const selectedCategory = categoriesOptions.find(
            (category) => category.value.toString() === values.categoryID
        );
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("stock", values.stock);
        formData.append("price", values.price);
        formData.append("categoryID", selectedCategory?.value || "");
        formData.append("image", values.image[0] || "");
        formData.append("colors", JSON.stringify(transformedColors));
        formData.append("sizes", JSON.stringify(transformedSizes));
        formData.append("storeID", values.storeID);

        createProductAction(formData);
    };

    return (
        <AppLayout>
            <div className="flex items-center gap-4">
                <ChevronRight
                    size={34}
                    className="mt-3 cursor-pointer"
                    onClick={() => {
                        navigate("/home");
                    }}
                />
                <h1 className="text-3xl font-semibold">اضافة منتج</h1>
            </div>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Grid gutter="lg">
                    <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                        <TextInput label="اسم المنتج" {...form.getInputProps("title")} />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                        <TextInput label="سعر المنتج" type="number" {...form.getInputProps("price")} />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                        <TextInput label="الكمية" type="number" {...form.getInputProps("stock")} />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                        <Select
                            searchable
                            label="القسم"
                            {...form.getInputProps("categoryID")}
                            limit={100}
                            data={categoriesOptions}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                        <Select
                            searchable
                            label="المتجر"
                            {...form.getInputProps("storeID")}
                            limit={100}
                            data={storesOptions}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                        <Select
                            label="الالوان"
                            searchable
                            data={colorsOptions}
                            limit={100}
                            onChange={(value) => {
                                const selectedColor = colorsOptions.find((color) => color.value === value);
                                const isColorAdded = form.values.colors.find(
                                    (color) => color.value === value
                                );
                                if (isColorAdded) {
                                    return;
                                }
                                if (selectedColor) {
                                    form.insertListItem("colors", {
                                        label: selectedColor.label,
                                        value: selectedColor.value,
                                        quantity: ""
                                    });
                                }
                            }}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">{productColors}</div>
                        {form.errors.colors && (
                            <div className="text-red-500 text-sm">يجب اضافة الالوان المتاحة</div>
                        )}
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                        <Select
                            label="المقاسات"
                            searchable
                            limit={100}
                            data={sizesOptions}
                            onChange={(value) => {
                                const selectedSize = sizesOptions.find((size) => size.value === value);
                                const isSizeAdded = form.values.sizes.find((size) => size.value === value);
                                if (isSizeAdded) {
                                    return;
                                }
                                if (selectedSize) {
                                    form.insertListItem("sizes", {
                                        label: selectedSize.label,
                                        value: selectedSize.value,
                                        quantity: ""
                                    });
                                }
                            }}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">{productSizes}</div>
                        {form.errors.sizes && (
                            <div className="text-red-500 text-sm">يجب اضافة المقاسات المتاحة</div>
                        )}
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 12, lg: 12, sm: 12, xs: 12 }}>
                        <ImageUploader
                            image={form.values.image}
                            onDrop={(files) => {
                                form.setFieldValue("image", files);
                            }}
                            onDelete={() => {
                                form.setFieldValue("image", []);
                            }}
                            error={!!form.errors.image}
                        />
                        {form.errors.image && <div className="text-red-500">{form.errors.image}</div>}
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                        <Button
                            type="submit"
                            fullWidth
                            mt="xl"
                            size="md"
                            loading={isLoading}
                            disabled={isLoading}
                        >
                            اضافة
                        </Button>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                        <Button
                            onClick={() => {
                                navigate("/home");
                            }}
                            type="submit"
                            variant="outline"
                            fullWidth
                            mt="xl"
                            size="md"
                        >
                            العودة
                        </Button>
                    </Grid.Col>
                </Grid>
            </form>
        </AppLayout>
    );
};
