import type { APIError } from "@/models";
import { deleteReportService } from "@/services/deleteReport";
import { ActionIcon, Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconTrashFilled } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";

export const PermanentlyDeleteReport = ({ id }: { id: number }) => {
    const [opened, { open, close }] = useDisclosure(false);
    const queryClient = useQueryClient();
    const { mutate: deleteReport, isLoading } = useMutation({
        mutationFn: (id: number) => deleteReportService({ id }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["reports"]
            });
            toast.success("تم مسح الكشف بنجاح");
            close();
        },
        onError: (error: AxiosError<APIError>) => {
            toast.error(error.response?.data.message || "حدث خطأ ما");
        }
    });

    const handleDelete = () => {
        deleteReport(id);
    };

    return (
        <>
            <Modal opened={opened} onClose={close} title="مسح الكشف" centered>
                هل انت متأكد من مسح الكشف؟ لا يمكن التراجع عن هذا الإجراء
                <div className="mt-4 flex items-center gap-4">
                    <Button loading={isLoading} disabled={isLoading} variant="filled" onClick={handleDelete}>
                        مسح
                    </Button>
                    <Button variant="outline" onClick={close} className="mr-4">
                        إلغاء
                    </Button>
                </div>
            </Modal>

            <div className="flex justify-center">
                <ActionIcon
                    variant="filled"
                    onClick={open}
                    className="mx-auto"
                    color="red"
                    aria-label="Settings"
                >
                    <IconTrashFilled />
                </ActionIcon>
            </div>
        </>
    );
};
