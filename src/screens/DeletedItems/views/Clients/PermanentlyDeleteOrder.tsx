import { deleteClientService } from "@/services/deleteClient";
import { ActionIcon, Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconTrashFilled } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const PermanentlyDeleteOrder = ({ clientId }: { clientId: number }) => {
    const [opened, { open, close }] = useDisclosure(false);
    const queryClient = useQueryClient();
    const { mutate: deleteBranch, isLoading } = useMutation({
        mutationFn: ({ id }: { id: number }) => deleteClientService({ id }),
        onSuccess: () => {
            toast.success("تم مسح العميل بنجاح");
            queryClient.invalidateQueries({
                queryKey: ["clients"]
            });
            close();
        }
    });

    const handleDelete = () => {
        deleteBranch({ id: clientId });
    };

    return (
        <>
            <Modal opened={opened} onClose={close} title="مسح الموظف" centered>
                هل انت متأكد من مسح العميل؟ لا يمكن التراجع عن هذا الإجراء
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
