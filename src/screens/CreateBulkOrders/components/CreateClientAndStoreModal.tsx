import { ImageUploader } from "@/components/CustomDropZone";
import { useBranches } from "@/hooks/useBranches";
import { useCreateClient } from "@/hooks/useCreateClient";
import { useCreateStore } from "@/hooks/useCreateStore";
import { useTenants } from "@/hooks/useTenants";
import { clientTypeArray, type clientTypeArabicNames } from "@/lib/clientTypeArabicNames";
import { useAuth } from "@/store/authStore";
import { Box, Button, Divider, Grid, Modal, PasswordInput, Select, TextInput, Textarea } from "@mantine/core";
import type { FileWithPath } from "@mantine/dropzone";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import { useEffect } from "react";
import type { z } from "zod";
import { createClientAndStoreModalSchema } from "./CreateClientAndStoreModal.zod";

export const CreateClientAndStoreModal = () => {
    const [opened, { open, close }] = useDisclosure(false);
    const { role, companyID: loggedInCompanyId } = useAuth();
    const { mutate: createClientAction, isLoading: isCreateClientLoading } = useCreateClient();
    const isAdminOrAdminAssistant = role === "ADMIN" || role === "ADMIN_ASSISTANT";
    const form = useForm({
        validate: zodResolver(createClientAndStoreModalSchema),
        initialValues: {
            clientName: "",
            phone: "",
            branch: "",
            type: "" as (typeof clientTypeArabicNames)["CLIENT"],
            avatar: [] as unknown as FileWithPath[],
            password: "",
            confirmPassword: "",
            companyID: "",
            storeName: "",
            notes: "",
            client: "",
            logo: [] as unknown as FileWithPath[]
        }
    });

    useEffect(() => {
        if (loggedInCompanyId) {
            form.setFieldValue("companyID", loggedInCompanyId.toString());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loggedInCompanyId]);

    const { data: branches } = useBranches({
        size: 100000,
        minified: true
    });
    const { data: tenants = { data: [] } } = useTenants({
        size: 100000,
        minified: true
    });

    const transformedTenants = tenants.data?.map((tenant) => ({
        value: tenant.id.toString(),
        label: tenant.name
    }));
    const transformedBranches = branches?.data.map((branch) => ({
        value: branch.id.toString(),
        label: branch.name
    }));

    const { mutate: createStoreAction, isLoading } = useCreateStore();

    const handleCreateStore = (values: z.infer<typeof createClientAndStoreModalSchema>, clientId: string) => {
        const formData = new FormData();
        formData.append("name", values.storeName);
        formData.append("notes", values.notes || "");
        formData.append("clientID", clientId);
        formData.append("logo", values.logo[0]);
        createStoreAction(formData, {
            onSuccess: () => {
                close();
                form.reset();
            }
        });
    };

    const handleCreateClient = (values: z.infer<typeof createClientAndStoreModalSchema>) => {
        const formData = new FormData();
        formData.append("name", values.clientName);
        formData.append("phone", values.phone);
        formData.append("branchID", values.branch);
        formData.append("role", values.type);
        formData.append("password", values.password);
        formData.append("username", values.phone);
        formData.append("avatar", values?.avatar[0] || "");
        if (isAdminOrAdminAssistant) {
            formData.append("companyID", values.companyID);
        } else {
            formData.append("companyID", loggedInCompanyId.toString());
        }
        createClientAction(formData, {
            onSuccess: (data) => {
                handleCreateStore(values, data.data.id.toString());
            }
        });
    };

    return (
        <>
            <Modal size="xl" opened={opened} onClose={close} title="انشاء عميل ومتجر" centered>
                <form className="space-y-4" onSubmit={form.onSubmit(handleCreateClient)}>
                    <Divider my="xs" variant="dashed" labelPosition="center" label={<Box>العميل</Box>} />
                    <Grid>
                        <Grid.Col span={{ xs: 12, sm: 12, md: 6 }}>
                            <TextInput
                                label="اسم العميل"
                                placeholder=""
                                className="w-full"
                                {...form.getInputProps("clientName")}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ xs: 12, sm: 12, md: 6 }}>
                            <TextInput
                                label="اسم المتجر"
                                placeholder="اسم المتجر"
                                variant="filled"
                                className="mb-4"
                                {...form.getInputProps("storeName")}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ xs: 12, sm: 12, md: 6 }}>
                            <Select
                                label="نوع الحساب"
                                placeholder="اختار النوع"
                                data={clientTypeArray}
                                {...form.getInputProps("type")}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ xs: 12, sm: 12, md: 6 }}>
                            <TextInput
                                label="رقم الهاتف"
                                placeholder=""
                                className="w-full"
                                {...form.getInputProps("phone")}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ xs: 12, sm: 12, md: 6 }}>
                            <Select
                                searchable
                                label="الفرع"
                                placeholder="اختار الفرع"
                                data={transformedBranches}
                                limit={100}
                                {...form.getInputProps("branch")}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ xs: 12, sm: 12, md: 6 }}>
                            {isAdminOrAdminAssistant && (
                                <Select
                                    searchable
                                    label="الشركة"
                                    placeholder="اختار الشركة"
                                    data={transformedTenants}
                                    limit={100}
                                    {...form.getInputProps("companyID")}
                                />
                            )}
                        </Grid.Col>
                        <Grid.Col span={12}>
                            <ImageUploader
                                image={form.values.avatar}
                                onDrop={(files) => {
                                    form.setFieldValue("avatar", files);
                                }}
                                onDelete={() => {
                                    form.setFieldValue("avatar", []);
                                }}
                                error={!!form.errors.avatar}
                            />
                            {form.errors.avatar && <div className="text-red-500">{form.errors.avatar}</div>}
                        </Grid.Col>
                        <Grid.Col span={{ xs: 12, sm: 12, md: 6 }}>
                            <PasswordInput
                                label="كلمة المرور"
                                placeholder="*******"
                                mt="md"
                                className="w-full"
                                {...form.getInputProps("password")}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ xs: 12, sm: 12, md: 6 }}>
                            <PasswordInput
                                label="تأكيد كلمة المرور"
                                placeholder="*******"
                                mt="md"
                                className="w-full"
                                {...form.getInputProps("confirmPassword")}
                            />
                        </Grid.Col>
                        <Grid.Col span={12}>
                            <Divider
                                my="xs"
                                variant="dashed"
                                labelPosition="center"
                                label={<Box>المتجر</Box>}
                            />
                        </Grid.Col>
                    </Grid>
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
                        <Button
                            type="submit"
                            loading={isLoading || isCreateClientLoading}
                            disabled={isLoading || isCreateClientLoading}
                            variant="filled"
                        >
                            اضافة
                        </Button>
                        <Button variant="outline" onClick={close} className="mr-4">
                            إلغاء
                        </Button>
                    </div>
                </form>
            </Modal>

            <Button rightSection={<IconPlus size={18} />} onClick={open} className="mb-4 md:mb-8">
                انشاء عميل ومتجر
            </Button>
        </>
    );
};
