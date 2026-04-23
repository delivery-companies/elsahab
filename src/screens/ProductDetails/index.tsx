import { AppLayout } from "@/components/AppLayout";
import { useProductDetails } from "@/hooks/useProductDetails";
import { Badge, Button, Grid, Image, Text, TextInput, rem } from "@mantine/core";
import { ChevronRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export const ProductScreen = () => {
    const navigate = useNavigate();
    const { id = "" } = useParams();
    const { data: productDetails, isLoading, isError } = useProductDetails(Number.parseInt(id));
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
                <h1 className="text-3xl font-semibold">تفاصيل المنتج {productDetails?.data.title}</h1>
            </div>
            <Grid gutter="md">
                <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                    <TextInput label="اسم المنتج" value={productDetails?.data.title} disabled />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                    <TextInput label="سعر المنتج" value={productDetails?.data.price} disabled />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                    <TextInput label="الكمية" value={productDetails?.data.stock} disabled />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                    <TextInput label="الصنف" value={productDetails?.data.category?.title} disabled />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                    <Image fit="contain" mah={rem(400)} radius="md" src={productDetails?.data.image || ""} />
                </Grid.Col>
                <Grid.Col className="space-y-2" span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                    <div className="flex flex-wrap gap-2 items-center">
                        <Text>الالوان:</Text>
                        {productDetails?.data.productColors.map((color) => (
                            <Badge
                                size="lg"
                                key={color.color.title}
                                variant="outline"
                                className="flex flex-wrap items-center mx-1"
                            >
                                اللون: {color.color.title} - المتوفر: {color.quantity}
                            </Badge>
                        ))}
                    </div>
                    <div className="flex flex-wrap gap-2 items-center">
                        <Text>الاحجام:</Text>
                        {productDetails?.data.productSizes.map((size) => (
                            <Badge
                                size="lg"
                                key={size.size.title}
                                className="flex flex-wrap items-center flex-col"
                            >
                                الحجم: {size.size.title} - المتوفر: {size.quantity}
                            </Badge>
                        ))}
                    </div>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                    <Button
                        fullWidth
                        onClick={() => {
                            navigate(`/home/${id}/edit`);
                        }}
                    >
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
        </AppLayout>
    );
};
