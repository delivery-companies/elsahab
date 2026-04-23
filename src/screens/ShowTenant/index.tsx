import { AppLayout } from "@/components/AppLayout";
import { useTenantDetails } from "@/hooks/useTenantDetails";
import { Button, Grid, Image, Switch, TextInput, Textarea } from "@mantine/core";
import { ChevronRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export const ShowTenant = () => {
    const { id = "" } = useParams();
    const navigate = useNavigate();
    const { data: tenantDetails, isLoading, isError } = useTenantDetails(Number.parseInt(id));
    return (
        <AppLayout isLoading={isLoading} isError={isError}>
            <div className="flex items-center gap-4">
                <ChevronRight
                    size={34}
                    className="mt-2 cursor-pointer"
                    onClick={() => {
                        navigate("/tenants");
                    }}
                />
                <h1 className="text-3xl font-semibold">بيانات الشركة</h1>
            </div>
            <Grid gutter="lg">
                <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                    <TextInput label="اسم الشركة" value={tenantDetails?.data.name} disabled />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                    <TextInput label="الهاتف" value={tenantDetails?.data.phone} disabled />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                    <TextInput label="الموقع" value={tenantDetails?.data.website} disabled />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                    <TextInput label="سعر توصيل لبغداد" value={tenantDetails?.data.baghdadPrice} disabled />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                    <TextInput
                        label="سعر توصيل للمحافظات"
                        value={tenantDetails?.data.governoratePrice}
                        disabled
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                    <TextInput label="تكلفة المندوب" value={tenantDetails?.data.deliveryAgentFee} disabled />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                    <TextInput
                        label="السعر الاضافي لكل 500000 دينار عراقي"
                        value={tenantDetails?.data.additionalPriceForEvery500000IraqiDinar}
                        disabled
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                    <TextInput
                        label="السعر الاضافي لكل كيلوغرام"
                        value={tenantDetails?.data.additionalPriceForEveryKilogram}
                        disabled
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                    <TextInput
                        label="السعر الاضافي للمناطق النائية"
                        value={tenantDetails?.data.additionalPriceForRemoteAreas}
                        disabled
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                    <Switch
                        className="mt-8"
                        checked={tenantDetails?.data.orderStatusAutomaticUpdate}
                        label="تحديث حالة الطلب تلقائيا"
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 12, lg: 12, sm: 12, xs: 12 }}>
                    <Image
                        className="w-64 h-[390px]"
                        fit="cover"
                        radius="lg"
                        src={tenantDetails?.data.logo || ""}
                        fallbackSrc="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 12, lg: 12, sm: 12, xs: 12 }}>
                    <Textarea
                        label="وصف الشركة"
                        value={tenantDetails?.data.registrationText}
                        disabled
                        rows={10}
                        maxRows={10}
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                    <Button
                        type="submit"
                        onClick={() => {
                            navigate(`/tenants/${id}/edit`);
                        }}
                        fullWidth
                        mt="xl"
                        size="md"
                    >
                        تعديل
                    </Button>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                    <Button
                        onClick={() => {
                            navigate("/tenants");
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
        </AppLayout>
    );
};
