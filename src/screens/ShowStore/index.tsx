import { AppLayout } from "@/components/AppLayout";
import { useStoreDetails } from "@/hooks/useStoreDetails";
import { Button, Grid, Image, TextInput, Textarea, rem } from "@mantine/core";
import { ChevronRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export const StoreScreen = () => {
    const navigate = useNavigate();
    const { id = "" } = useParams();
    const { data: storeDetails, isLoading, isError } = useStoreDetails(Number.parseInt(id));
    return (
        <AppLayout isLoading={isLoading} isError={isError}>
            <div className="flex items-center gap-4 mb-6">
                <ChevronRight
                    size={34}
                    className="mt-2 cursor-pointer"
                    onClick={() => {
                        navigate("/stores");
                    }}
                />
                <h1 className="text-3xl font-semibold">تفاصيل المتجر {storeDetails?.data.name}</h1>
            </div>
            <Grid gutter="md">
                <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                    <TextInput label="اسم المتجر" value={storeDetails?.data.name} disabled />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                    <TextInput label="العميل" value={storeDetails?.data.client.name} disabled />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 12, xs: 12 }}>
                    <Image fit="contain" mah={rem(400)} radius="md" src={storeDetails?.data.logo || ""} />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 12, lg: 12, sm: 12, xs: 12 }}>
                    <Textarea
                        label="الملاحظات"
                        value={storeDetails?.data.notes}
                        rows={10}
                        maxRows={10}
                        disabled
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                    <Button
                        fullWidth
                        onClick={() => {
                            navigate(`/stores/${storeDetails?.data.id}/edit`);
                        }}
                    >
                        تعديل
                    </Button>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                    <Button
                        onClick={() => {
                            navigate("/stores");
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
