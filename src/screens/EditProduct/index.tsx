import { AppLayout } from "@/components/AppLayout";
import { ImageUploader } from "@/components/CustomDropZone";
import { useCategory } from "@/hooks/useCategory";
import { useColors } from "@/hooks/useColors";
import { useProductDetails } from "@/hooks/useProductDetails";
import { useSizes } from "@/hooks/useSizes";
import type { APIError } from "@/models";
import { editProductService } from "@/services/editProduct";
import { Badge, Button, Grid, Select, TextInput } from "@mantine/core";
import type { FileWithPath } from "@mantine/dropzone";
import { useForm, zodResolver } from "@mantine/form";
import { IconX } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { ChevronRight } from "lucide-react";
import { useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import type { z } from "zod";
import { editProductSchema } from "./schema";

export const EditProductScreen = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { id = "" } = useParams();
    const { data: productDetails, isLoading, isError } = useProductDetails(Number.parseInt(id));

    const form = useForm({
        validate: zodResolver(editProductSchema),
        initialValues: {
            title: "",
            price: 0,
            stock: "",
            categoryID: "",
            colors: [] as unknown as {
                label: string;
                value: string;
                quantity: string;
            }[],
            sizes: [] as unknown as {
                label: string;
                value: string;
                quantity: string;
            }[],
            image: [] as unknown as FileWithPath[]
        }
    });

    const { data: categories } = useCategory({
        size: 100000,
        minified: true
    });
    const categoryOptions = useMemo(() => {
        return categories?.data.map((category) => ({
            value: category.id.toString(),
            label: category.title
        }));
    }, [categories]);

    useEffect(() => {
        if (productDetails) {
            const selectedCategory = categoryOptions?.find(
                (category) => category.label === productDetails.data.category?.title
            );
            const imageAddress = productDetails.data.image;
            form.setValues({
                title: productDetails.data.title,
                price: productDetails.data.price,
                stock: productDetails.data.stock.toString(),
                categoryID: selectedCategory?.value.toString() || "",
                colors: productDetails.data.productColors.map((color) => ({
                    label: color.color.title,
                    quantity: color.quantity.toString(),
                    value: color.color.id.toString()
                })),
                sizes: productDetails.data.productSizes.map((size) => ({
                    label: size.size.title,
                    value: size.size.id.toString(),
                    quantity: size.quantity.toString()
                })),
                image: [imageAddress] as unknown as FileWithPath[]
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categoryOptions, productDetails]);

    const { data: colors = { data: [] } } = useColors({
        size: 100000,
        minified: true
    });
    const colorsOptions = colors.data.map((color) => ({
        value: color.id.toString(),
        label: color.title
    }));
    const { data: sizes = { data: [] } } = useSizes({
        size: 100000,
        minified: true
    });
    const sizesOptions = sizes.data.map((size) => ({
        value: size.id.toString(),
        label: size.title
    }));

    const productColors = form.values.colors.map((color, index) => {
        return (
            <div key={color.label} className="relative">
                <TextInput
                    type="number"
                    label={
                        <div className="mb-2">
                            <Badge>اللون: {color.label}</Badge>
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
            <div key={size.label} className="relative">
                <TextInput
                    type="number"
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

    const { mutate: editProductAction, isLoading: isEdditing } = useMutation({
        mutationFn: (data: FormData) => {
            return editProductService({
                data,
                id: Number.parseInt(id)
            });
        },
        onSuccess: () => {
            toast.success("تم تعديل المنتج بنجاح");
            navigate("/home");
            queryClient.invalidateQueries({
                queryKey: ["products"]
            });
        },
        onError: (error: AxiosError<APIError>) => {
            toast.error(error.response?.data.message || "حدث خطأ ما");
        }
    });
    const handleSubmit = (values: z.infer<typeof editProductSchema>) => {
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
            quantity: Number.parseInt(color.quantity)
        }));
        const transformedSizes = values.sizes.map((size) => ({
            sizeID: size.value,
            quantity: Number.parseInt(size.quantity)
        }));
        const selectedCategory = categoryOptions?.find((category) => category.value === values.categoryID);

        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("price", String(values.price));
        formData.append("stock", values.stock);
        formData.append("categoryID", selectedCategory?.value || "");
        formData.append("image", values.image[0] || "");
        formData.append("colors", JSON.stringify(transformedColors));
        formData.append("sizes", JSON.stringify(transformedSizes));
        editProductAction(formData);
    };

    return (
        <AppLayout isLoading={isLoading} isError={isError}>
            <div className="flex items-center gap-4 mb-6">
                <ChevronRight
                    size={34}
                    className="mt-2 cursor-pointer"
                    onClick={() => {
                        navigate("/home");
                    }}
                />
                <h1 className="text-3xl font-semibold">تعديل المنتج {productDetails?.data.title}</h1>
            </div>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Grid gutter="md">
                    <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                        <TextInput label="اسم المنتج" {...form.getInputProps("title")} />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                        <TextInput label="سعر المنتج" {...form.getInputProps("price")} />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                        <TextInput label="الكمية" {...form.getInputProps("stock")} />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                        <Select
                            key={form.values.categoryID}
                            label="الصنف"
                            limit={100}
                            data={categoryOptions}
                            {...form.getInputProps("categoryID")}
                        />
                    </Grid.Col>
                    <Grid.Col className="space-y-2" span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                        <Select
                            label="الالوان"
                            data={colorsOptions}
                            limit={100}
                            onChange={(value) => {
                                const selectedColor = colorsOptions.find(
                                    (color) => color.value.toString() === value
                                );
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
                            data={sizesOptions}
                            limit={100}
                            onChange={(value) => {
                                const selectedSize = sizesOptions.find(
                                    (size) => size.value.toString() === value
                                );
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
                        <Button type="submit" fullWidth disabled={isEdditing} loading={isEdditing}>
                            تعديل
                        </Button>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                        <Button
                            onClick={() => {
                                navigate("/home");
                            }}
                            fullWidth
                            variant="outline"
                        >
                            العودة
                        </Button>
                    </Grid.Col>
                </Grid>
            </form>
        </AppLayout>
    );
};
