import type { APIError } from "@/models";
import { deleteRepositoryService } from "@/services/deleteRepositoryService";
import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";

export const DeleteRepository = ({
    repositoryId
}: {
    repositoryId: number;
}) => {
    const [opened, { open, close }] = useDisclosure(false);
    const queryClient = useQueryClient();
    const { mutate: deleteRepositoryAction, isLoading } = useMutation({
        mutationFn: ({ id }: { id: number }) => deleteRepositoryService({ id }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["repositories"]
            });
            toast.success("تم مسح المخزن بنجاح");
            close();
        },
        onError: (error: AxiosError<APIError>) => {
            toast.error(error.response?.data.message || "حدث خطأ ما");
        }
    });

    const handleDelete = () => {
        deleteRepositoryAction({ id: repositoryId });
    };

    return (
        <>
            <Modal opened={opened} onClose={close} title="مسح المخزن" centered>
                هل انت متأكد من مسح المخزن؟ لا يمكن التراجع عن هذا الإجراء
                <div className="mt-4 flex items-center gap-4">
                    <Button loading={isLoading} disabled={isLoading} variant="filled" onClick={handleDelete}>
                        مسح
                    </Button>
                    <Button variant="outline" onClick={close} className="mr-4">
                        إلغاء
                    </Button>
                </div>
            </Modal>

            <Button fullWidth variant="filled" onClick={open}>
                مسح
            </Button>
        </>
    );
};
