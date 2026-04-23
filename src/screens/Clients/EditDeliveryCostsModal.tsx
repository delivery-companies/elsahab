import { type governorateArabicNames, governorateArray } from "@/lib/governorateArabicNames ";
import type { APIError } from "@/models";
import { editClientService } from "@/services/editClient";
import { Button, Grid, Modal, NumberInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useEffect } from "react";
import toast from "react-hot-toast";

interface EditDeliveryCostsModalProps {
    clientId: number;
    governoratesDeliveryCosts: {
        cost: number;
        governorate: keyof typeof governorateArabicNames;
    }[];
}

export const EditDeliveryCostsModal = ({
    clientId,
    governoratesDeliveryCosts
}: EditDeliveryCostsModalProps) => {
    const queryClient = useQueryClient();
    const [opened, { open, close }] = useDisclosure(false);

    const form = useForm({
        initialValues: {
            ...governorateArray.reduce(
                (acc, governorate) => ({
                    ...acc,
                    [governorate.value]: 0
                }),
                {}
            )
        }
    });

    useEffect(() => {
        governoratesDeliveryCosts.forEach((governorate) => {
            form.setFieldValue(governorate.governorate, governorate.cost);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [governoratesDeliveryCosts]);

    const { mutate: editClientAction, isLoading: isEditing } = useMutation({
        mutationFn: (data: FormData) => {
            return editClientService({ id: clientId, data });
        },
        onSuccess: () => {
            toast.success("تم تعديل تكاليف التوصيل بنجاح");
            queryClient.invalidateQueries({
                queryKey: ["clients"]
            });
            close();
            form.reset();
        },
        onError: (error: AxiosError<APIError>) => {
            toast.error(error.response?.data.message || "حدث خطأ ما");
        }
    });

    const handleSubmit = () => {
        const formData = new FormData();
        const values = form.values as Record<string, number>;

        const transformedGovernorateArray = governorateArray.map((governorate) => ({
            governorate: governorate.value,
            cost: values[governorate.value]
        }));

        formData.append("governoratesDeliveryCosts", JSON.stringify(transformedGovernorateArray));

        editClientAction(formData);
    };

    return (
        <>
            <Modal opened={opened} onClose={close} title="تعديل تكلفة التوصيل" centered size="auto">
                <Grid gutter="md">
                    {governorateArray.map((governorate) => (
                        <Grid.Col key={governorate.value} span={{ base: 12, xs: 12, md: 6, sm: 12, lg: 4 }}>
                            <NumberInput
                                label={`تكلفة ${governorate.label}`}
                                placeholder="تكلفة التوصيل"
                                allowNegative={false}
                                allowDecimal={false}
                                {...form.getInputProps(governorate.value)}
                            />
                        </Grid.Col>
                    ))}
                    <Grid.Col span={{ base: 12, xs: 12, md: 6, sm: 12, lg: 6 }}>
                        <Button
                            loading={isEditing}
                            disabled={isEditing}
                            fullWidth
                            variant="filled"
                            onClick={handleSubmit}
                        >
                            حفظ
                        </Button>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, xs: 12, md: 6, sm: 12, lg: 6 }}>
                        <Button fullWidth variant="outline" onClick={close}>
                            إلغاء
                        </Button>
                    </Grid.Col>
                </Grid>
            </Modal>
            <Button variant="outline" onClick={open}>
                تعديل تكلفه التوصيل
            </Button>
        </>
    );
};
