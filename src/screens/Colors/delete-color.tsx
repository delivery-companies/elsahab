import type { APIError } from "@/models";
import { deleteColorService } from "@/services/deleteColor";
import { ActionIcon, Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";

export const DeleteColor = ({ colorId }: { colorId: number }) => {
    const [opened, { open, close }] = useDisclosure(false);
    const queryClient = useQueryClient();
    const { mutate: deleteSize, isLoading } = useMutation({
        mutationFn: (id: number) => deleteColorService({ id }),
        onSuccess: () => {
            toast.success("تم حذف اللون بنجاح");
            queryClient.invalidateQueries({
                queryKey: ["colors"]
            });
            close();
        },
        onError: (error: AxiosError<APIError>) => {
            toast.error(error.response?.data.message || "حدث خطأ أثناء حذف اللون");
        }
    });

    const handleDelete = () => {
        deleteSize(colorId);
    };

    return (
        <>
            <Modal opened={opened} onClose={close} title="مسح المخزن" centered>
                هل انت متأكد من مسح اللون؟ لا يمكن التراجع عن هذا الإجراء
                <div className="mt-4 flex items-center gap-4">
                    <Button loading={isLoading} disabled={isLoading} variant="filled" onClick={handleDelete}>
                        مسح
                    </Button>
                    <Button variant="outline" onClick={close} className="mr-4">
                        إلغاء
                    </Button>
                </div>
            </Modal>

            <ActionIcon size="lg" color="red" onClick={open}>
                <IconTrash className="text-white" />
            </ActionIcon>
        </>
    );
};
