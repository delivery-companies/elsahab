import type { APIError } from "@/models";
import { deleteCategoryService } from "@/services/deleteCategory";
import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";

export const DeleteCategory = ({ categoryId }: { categoryId: number }) => {
    const [opened, { open, close }] = useDisclosure(false);
    const queryClient = useQueryClient();
    const { mutate: deleteCategory, isLoading } = useMutation({
        mutationFn: (id: number) => deleteCategoryService({ id }),
        onSuccess: () => {
            toast.success("تم حذف الصنف بنجاح");
            queryClient.invalidateQueries({
                queryKey: ["categories"]
            });
            close();
        },
        onError: (error: AxiosError<APIError>) => {
            toast.error(error.response?.data.message || "حدث خطأ أثناء حذف الصنف");
        }
    });

    const handleDelete = () => {
        deleteCategory(categoryId);
    };

    return (
        <>
            <Modal opened={opened} onClose={close} title="مسح الصنف" centered>
                هل انت متأكد من مسح الصنف؟ لا يمكن التراجع عن هذا الإجراء
                <div className="mt-4 flex items-center gap-4">
                    <Button loading={isLoading} disabled={isLoading} variant="filled" onClick={handleDelete}>
                        مسح
                    </Button>
                    <Button variant="outline" onClick={close} className="mr-4">
                        إلغاء
                    </Button>
                </div>
            </Modal>

            <IconTrash onClick={open} className="text-primary cursor-pointer" size={24} />
        </>
    );
};
