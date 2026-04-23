import { useChangeOrderStatus } from "@/hooks/useChangeOrderStatus";
import { useDeactivateOrder } from "@/hooks/useDeactivateOrder";
import { useClientOrdersStore } from "@/store/confirmClientOrders";
import { Button ,Modal} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import toast from "react-hot-toast";

export const ClientOrdersActions = () => {
    const { clientOrders, deleteAllClientOrders } = useClientOrdersStore();
    const { mutate: confirmOrder, isLoading } = useChangeOrderStatus();
    const { mutateAsync: deleteOrder, isLoading: isDeletingOrderLoading } = useDeactivateOrder();
    const [deleteOpened, { open:openDelete, close:closeDelete }] = useDisclosure(false);
    const [confirmOpened, { open:confirmOpen, close:confirmCLose }] = useDisclosure(false);

    const handleConfirmOrder = () => {
        clientOrders.forEach((order) => {
            confirmOrder({
                id: order.id,
                data: {
                    confirmed: true
                }
            });
        });
        toast.success("تم تعديل حالة الطلب بنجاح");
        deleteAllClientOrders();
        confirmCLose()
    };

    const handleDeleteOrders = () => {
        clientOrders.forEach((order) => {
            deleteOrder(order.id);
        });
        toast.success("تم حذف الطلبات بنجاح");
        deleteAllClientOrders();
        closeDelete()
    };

    return (
        <>
            <Modal opened={deleteOpened} onClose={closeDelete} title="مسح الطلب" centered>
                هل انت متأكد من مسح الطلب؟
                <div className="mt-4 flex items-center gap-4">
                    <Button loading={isLoading} disabled={isLoading} variant="filled" onClick={handleDeleteOrders}>
                        مسح
                    </Button>
                    <Button variant="outline" onClick={closeDelete} className="mr-4">
                        إلغاء
                    </Button>
                </div>
            </Modal>
            <Modal opened={confirmOpened} onClose={confirmCLose} title="مسح الطلب" centered>
                هل انت متأكد من تأكيد الطلبات المحدده؟
                <div className="mt-4 flex items-center gap-4">
                    <Button loading={isLoading} disabled={isLoading} variant="filled" onClick={handleConfirmOrder}>
                        تأكيد
                    </Button>
                    <Button variant="outline" onClick={confirmCLose} className="mr-4">
                        إلغاء
                    </Button>
                </div>
            </Modal>
            <div className="flex items-center gap-6 mb-4">
                <Button
                    disabled={clientOrders.length === 0 || isLoading || isDeletingOrderLoading}
                    onClick={confirmOpen}
                >
                    تأكيد الطلبات المحددة
                </Button>
                <Button
                    disabled={clientOrders.length === 0 || isLoading || isDeletingOrderLoading}
                    onClick={openDelete}
                >
                    مسح الطلبات المحددة
                </Button>
            </div>
        </>
    );
};
