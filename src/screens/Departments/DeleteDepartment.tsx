import { deleteDepartmentService } from "@/services/departments";
import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const DeleteDepartment = ({ id }: { id: number }) => {
    const [opened, { open, close }] = useDisclosure(false);
    const queryClient = useQueryClient();
    const { mutate: deleteDepartment, isLoading } = useMutation({
        mutationFn: ({ id }: { id: number }) => deleteDepartmentService({ id }),
        onSuccess: () => {
            toast.success("تم مسح القسم بنجاح");
            queryClient.invalidateQueries({
                queryKey: ["department"]
            });
            close();
        }
    });

    const handleDelete = () => {
        deleteDepartment({ id });
    };

    return (
        <>
            <Modal opened={opened} onClose={close} title="مسح قسم" centered>
                هل انت متأكد من مسح القسم؟ لا يمكن التراجع عن هذا الإجراء
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
