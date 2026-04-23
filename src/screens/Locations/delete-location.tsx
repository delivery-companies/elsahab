import type { APIError } from "@/models";
import { deleteLocationService } from "@/services/deleteLocation";
import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";

export const DeleteLocation = ({ id }: { id: number }) => {
    const [opened, { open, close }] = useDisclosure(false);
    const queryClient = useQueryClient();
    const { mutate: deleteLocation, isLoading } = useMutation({
        mutationFn: (id: number) => deleteLocationService({ id }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["locations"]
            });
            toast.success("تم مسح المنطقة بنجاح");
            close();
        },
        onError: (error: AxiosError<APIError>) => {
            toast.error(error.response?.data.message || "حدث خطأ ما");
        }
    });

    const handleDelete = () => {
        deleteLocation(id);
    };

    return (
        <>
            <Modal opened={opened} onClose={close} title="مسح الموظف" centered>
                هل انت متأكد من مسح المنطقة؟ لا يمكن التراجع عن هذا الإجراء
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
