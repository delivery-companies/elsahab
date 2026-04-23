import { deleteBranchService } from "@/services/deleteBranchService";
import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const DeleteBranch = ({ branchId }: { branchId: number }) => {
    const [opened, { open, close }] = useDisclosure(false);
    const queryClient = useQueryClient();
    const { mutate: deleteBranch, isLoading } = useMutation({
        mutationFn: ({ id }: { id: number }) => deleteBranchService({ id }),
        onSuccess: () => {
            toast.success("تم مسح الفرع بنجاح");
            queryClient.invalidateQueries({
                queryKey: ["branches"]
            });
            close();
        }
    });

    const handleDelete = () => {
        deleteBranch({ id: branchId });
    };

    return (
        <>
            <Modal opened={opened} onClose={close} title="مسح الموظف" centered>
                هل انت متأكد من مسح الفرع؟ لا يمكن التراجع عن هذا الإجراء
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
