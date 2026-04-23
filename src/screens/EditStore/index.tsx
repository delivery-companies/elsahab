import { AppLayout } from "@/components/AppLayout";
import { ImageUploader } from "@/components/CustomDropZone";
import { useClients } from "@/hooks/useClients";
import { useStoreDetails } from "@/hooks/useStoreDetails";
import type { APIError } from "@/models";
import { editStoreService } from "@/services/editStore";
import { Button, Grid, Select, TextInput, Textarea } from "@mantine/core";
import type { FileWithPath } from "@mantine/dropzone";
import { useForm, zodResolver } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { ChevronRight } from "lucide-react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import type { z } from "zod";
import { editProductSchema } from "./schema";

const EditStore = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { id = "" } = useParams();
    const { data: clients } = useClients({ size: 100000, minified: true });
    const clientOptions = clients?.data.map((client) => ({
        label: client.name,
        value: client.id.toString()
    }));

    const { data: storeDetails, isLoading, isError } = useStoreDetails(Number.parseInt(id));
    const form = useForm({
        validate: zodResolver(editProductSchema),
        initialValues: {
            name: "",
            notes: "",
            client: "",
            logo: [] as unknown as FileWithPath[]
        }
    });

    useEffect(() => {
        if (storeDetails) {
            const imageAddress = storeDetails.data.logo;

            form.setValues({
                name: storeDetails.data.name,
                notes: storeDetails.data.notes,
                client: storeDetails.data.client.id.toString(),
                logo: [imageAddress] as unknown as FileWithPath[]
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [storeDetails]);

    const { mutate: editProductAction, isLoading: isEditting } = useMutation({
        mutationFn: ({ id, data }: { id: number; data: FormData }) => {
            return editStoreService({ id, data });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["stores"]
            });
            toast.success("تم تعديل المتجر بنجاح");
            navigate("/stores");
        },
        onError: (error: AxiosError<APIError>) => {
            toast.error(error.response?.data.message || "حدث خطأ أثناء تعديل المتجر");
        }
    });

    const handeSubmit = (values: z.infer<typeof editProductSchema>) => {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("notes", values.notes);
        formData.append("clientID", values.client);
        if (values.logo[0] instanceof File) {
            formData.append("logo", values.logo[0]);
        }
        editProductAction({
            id: Number.parseInt(id),
            data: formData
        });
    };

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
            <form onSubmit={form.onSubmit(handeSubmit)}>
                <Grid gutter="md">
                    <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                        <TextInput label="اسم المتجر" {...form.getInputProps("name")} />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                        <Select
                            label="العميل"
                            searchable
                            data={clientOptions}
                            limit={100}
                            {...form.getInputProps("client")}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 12, xs: 12 }}>
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
                        <Textarea label="الملاحظات" rows={10} maxRows={10} {...form.getInputProps("notes")} />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                        <Button loading={isEditting} disabled={isEditting} fullWidth type="submit">
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
            </form>
        </AppLayout>
    );
};

export default EditStore;
