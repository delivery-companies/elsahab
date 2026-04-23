import type { APIError } from "@/models";
import { type CreateSizePayload, createSizeService } from "@/services/createSize";
import { Button, Modal, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { type FormEvent, useState } from "react";
import toast from "react-hot-toast";

export const AddSize = () => {
    const [opened, { open, close }] = useDisclosure(false);
    const [sizeName, setSizeName] = useState("");
    const queryClient = useQueryClient();
    const { mutate: addSizeAction, isLoading } = useMutation({
        mutationFn: ({ title }: CreateSizePayload) => createSizeService({ title }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["sizes"]
            });
            toast.success("تم اضافة الحجم بنجاح");
            close();
        },
        onError: (error: AxiosError<APIError>) => {
            toast.error(error.response?.data.message || "حدث خطأ ما");
        }
    });

    const handleAdd = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        addSizeAction({ title: sizeName });
    };

    return (
        <>
            <Modal opened={opened} onClose={close} title="اضافة حجم" centered>
                <form onSubmit={handleAdd}>
                    <TextInput
                        label="اسم الحجم"
                        placeholder="اسم الحجم"
                        required
                        variant="filled"
                        className="mb-4"
                        value={sizeName}
                        onChange={(e) => setSizeName(e.currentTarget.value)}
                    />
                    <div className="mt-4 flex items-center gap-4">
                        <Button
                            type="submit"
                            loading={isLoading}
                            disabled={!sizeName || isLoading}
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
                اضافة حجم جديد
            </Button>
        </>
    );
};
