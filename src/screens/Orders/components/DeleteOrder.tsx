import { useDeactivateOrder } from "@/hooks/useDeactivateOrder";
import { Button, Modal } from "@mantine/core";
import toast from "react-hot-toast";

interface Props {
    id: string;
    opened: boolean;
    close: () => void;
    open: () => void;
    closeMenu: () => void;
}

export const DeleteOrder = ({ id, close, open, opened, closeMenu }: Props) => {
    const { mutate: deleteOrder, isLoading } = useDeactivateOrder();

    const handleClose = () => {
        close();
        closeMenu();
    };

    const handleDelete = () => {
        deleteOrder(id, {
            onSuccess: () => {
                toast.success("تم اضافة الطلب الي قائمة المحذوفات بنجاح");
                handleClose();
            }
        });
    };

    return (
        <>
            <Modal opened={opened} onClose={handleClose} title="مسح الطلب" centered>
                هل انت متأكد من مسح الطلب؟
                <div className="mt-4 flex items-center gap-4">
                    <Button loading={isLoading} disabled={isLoading} variant="filled" onClick={handleDelete}>
                        مسح
                    </Button>
                    <Button variant="outline" onClick={handleClose} className="mr-4">
                        إلغاء
                    </Button>
                </div>
            </Modal>

            <Button className="mb-2" fullWidth variant="filled" onClick={open}>
                مسح
            </Button>
        </>
    );
};
