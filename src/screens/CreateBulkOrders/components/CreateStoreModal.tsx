import { ImageUploader } from "@/components/CustomDropZone";
import { useClients } from "@/hooks/useClients";
import { useCreateStore } from "@/hooks/useCreateStore";
import { createProductSchema } from "@/screens/AddStore/schema";
import { Button, Modal, Select, TextInput, Textarea } from "@mantine/core";
import type { FileWithPath } from "@mantine/dropzone";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import type { z } from "zod";

export const CreateStoreModal = () => {
    const [opened, { open, close }] = useDisclosure(false);
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

    const handleCreateStore = (values: z.infer<typeof createProductSchema>) => {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("notes", values.notes || "");
        formData.append("clientID", values.client);
        formData.append("logo", values.logo[0]);
        createStoreAction(formData, {
            onSuccess: () => {
                close();
                form.reset();
            }
        });
    };
    return (
        <>
            <Modal opened={opened} onClose={close} title="اضافة لون" centered>
                <form className="space-y-4" onSubmit={form.onSubmit(handleCreateStore)}>
                    <TextInput
                        label="اسم المتجر"
                        placeholder="اسم المتجر"
                        required
                        variant="filled"
                        className="mb-4"
                        {...form.getInputProps("name")}
                    />
                    <Select
                        searchable
                        label="العملاء"
                        placeholder="اختر العميل"
                        data={clientOptions}
                        limit={100}
                        {...form.getInputProps("client")}
                    />
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

                    <Textarea
                        label="الملاحظات"
                        {...form.getInputProps("notes")}
                        autosize
                        minRows={2}
                        maxRows={4}
                    />
                    <div className="mt-4 flex items-center gap-4">
                        <Button type="submit" loading={isLoading} disabled={isLoading} variant="filled">
                            اضافة
                        </Button>
                        <Button variant="outline" onClick={close} className="mr-4">
                            إلغاء
                        </Button>
                    </div>
                </form>
            </Modal>

            <Button rightSection={<IconPlus size={18} />} onClick={open} className="mb-4 md:mb-8">
                اضافة متجر
            </Button>
        </>
    );
};
