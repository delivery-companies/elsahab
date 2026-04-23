import { AppLayout } from "@/components/AppLayout";
import { ImageUploader } from "@/components/CustomDropZone";
import { useClients } from "@/hooks/useClients";
import { useCreateStore } from "@/hooks/useCreateStore";
import { Button, Grid, Select, TextInput, Textarea } from "@mantine/core";
import type { FileWithPath } from "@mantine/dropzone";
import { useForm, zodResolver } from "@mantine/form";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { z } from "zod";
import { createProductSchema } from "./schema";

export const AddStore = () => {
    const navigate = useNavigate();
    const form = useForm({
        validate: zodResolver(createProductSchema),
        initialValues: {
            name: "",
            notes: "",
            client: "",
            logo: [] as unknown as FileWithPath[]
        }
    });

    const {
        data: clients = {
            data: []
        }
    } = useClients({ size: 100000, minified: true });
    const clientOptions = clients.data.map((client) => ({
        label: client.name,
        value: client.id.toString()
    }));

    const { mutate: createStoreAction, isLoading } = useCreateStore();

    const handleSubmit = (values: z.infer<typeof createProductSchema>) => {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("notes", values.notes || "");
        formData.append("clientID", values.client);
        formData.append("logo", values.logo[0]);
        createStoreAction(formData);
    };
    return (
        <AppLayout>
            <div className="flex items-center gap-4 mb-6">
                <ChevronRight
                    size={34}
                    className="mt-2 cursor-pointer"
                    onClick={() => {
                        navigate("/stores");
                    }}
                />
                <h1 className="text-3xl font-semibold">اضافة متجر جديد</h1>
            </div>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Grid gutter="md">
                    <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                        <TextInput label="اسم المتجر" {...form.getInputProps("name")} />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                        <Select
                            searchable
                            label="العميل"
                            data={clientOptions}
                            limit={100}
                            {...form.getInputProps("client")}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 12, lg: 12, sm: 12, xs: 12 }}>
                        <ImageUploader
                            image={form.values.logo}
                            onDrop={(files) => {
                                form.setFieldValue("logo", files);
                            }}
                            onDelete={() => {
                                form.setFieldValue("logo", []);
                            }}
                            error={!!form.errors.logo}
                        />
                        {form.errors.logo && <div className="text-red-500">{form.errors.logo}</div>}
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 12, lg: 12, sm: 12, xs: 12 }}>
                        <Textarea label="الملاحظات" {...form.getInputProps("notes")} rows={10} maxRows={10} />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                        <Button disabled={isLoading} loading={isLoading} fullWidth type="submit">
                            اضافة
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
            </form>
        </AppLayout>
    );
};
