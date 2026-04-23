import type { APIError } from "@/models";
import { editSizeService } from "@/services/editSize";
import { ActionIcon, Button, Modal, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPencil } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { type FormEvent, useState } from "react";
import toast from "react-hot-toast";

export const EditSize = ({
    sizeId,
    title
}: {
    sizeId: number;
    title: string;
}) => {
    const [sizeTitle, setSizeTitle] = useState(title);
    const [opened, { open, close }] = useDisclosure(false);
    const queryClient = useQueryClient();
    const { mutate: editSize, isLoading } = useMutation({
        mutationFn: ({ id, title }: { title: string; id: number }) => editSizeService({ id, title }),
        onSuccess: () => {
            toast.success("تم تعديل الحجم بنجاح");
            queryClient.invalidateQueries({
                queryKey: ["sizes"]
            });
            close();
        },
        onError: (error: AxiosError<APIError>) => {
            toast.error(error.response?.data.message || "حدث خطأ أثناء تعديل الحجم");
        }
    });

    const handleEdit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        editSize({
            id: sizeId,
            title: sizeTitle
        });
    };

    return (
        <>
            <Modal opened={opened} onClose={close} title="تعديل الحجم" centered>
                <form onSubmit={handleEdit}>
                    <TextInput
                        value={sizeTitle}
                        onChange={(event) => setSizeTitle(event.currentTarget.value)}
                        label="الحجم"
                        required
                        placeholder="الحجم"
                        className="mb-4"
                    />
                    <div className="mt-4 flex items-center gap-4">
                        <Button loading={isLoading} disabled={isLoading || !sizeTitle} variant="filled">
                            تعديل
                        </Button>
                        <Button variant="outline" onClick={close} className="mr-4">
                            إلغاء
                        </Button>
                    </div>
                </form>
            </Modal>
            <ActionIcon size="lg" color="yellow" onClick={open}>
                <IconPencil className="text-white" />
            </ActionIcon>
        </>
    );
};
