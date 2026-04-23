import { useDeactivateReport } from "@/hooks/useDeactivateReport";
import { useRepositoryReportsStore } from "@/store/repositoryReportsOrders";
import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import toast from "react-hot-toast";

export const DeleteAllSelectedRepositoryOrders = () => {
    const [opened, { open, close }] = useDisclosure(false);
    const { repositoryReportsOrders, deleteAllRepositoryReportsOrders } = useRepositoryReportsStore();
    const { mutateAsync: deleteReport, isLoading } = useDeactivateReport();

    const handleDelete = async () => {
        await Promise.all(
            repositoryReportsOrders.map(async (order) => {
                await deleteReport(Number(order.id));
            })
        );

        toast.success("تم اضافة الكشوفات لقائمة المحذوفات بنجاح");
        deleteAllRepositoryReportsOrders();
        close();
    };

    return (
        <>
            <Modal opened={opened} onClose={close} title="مسح الكشوفات" centered>
                هل انت متأكد من مسح الكشوفات؟
                <div className="mt-4 flex items-center gap-4">
                    <Button loading={isLoading} disabled={isLoading} variant="filled" onClick={handleDelete}>
                        مسح
                    </Button>
                    <Button variant="outline" onClick={close} className="mr-4">
                        إلغاء
                    </Button>
                </div>
            </Modal>

            <Button disabled={repositoryReportsOrders.length === 0} variant="filled" onClick={open}>
                مسح الصفوف المحددة
            </Button>
        </>
    );
};
