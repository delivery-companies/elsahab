import type { APIError } from "@/models";
import { deactivateStoreService } from "@/services/deactivateStore";
import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";

export const DeleteStore = ({ storeId }: { storeId: number }) => {
    const [opened, { open, close }] = useDisclosure(false);
    const queryClient = useQueryClient();
    const { mutate: deleteStore, isLoading } = useMutation({
        mutationFn: (id: number) => deactivateStoreService({ id }),
        onSuccess: () => {
            toast.success("تم اضافة المتجر الي قائمة المحذوفات بنجاح");
            queryClient.invalidateQueries({
                queryKey: ["stores"]
            });
            close();
        },
        onError: (error: AxiosError<APIError>) => {
            toast.error(error.response?.data.message || "حدث خطأ أثناء حذف المتجر");
        }
    });

    const handleDelete = () => {
        deleteStore(storeId);
    };

    return (
        <>
            <Modal opened={opened} onClose={close} title="مسح المتجر" centered>
                هل انت متأكد من مسح المتجر؟
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
