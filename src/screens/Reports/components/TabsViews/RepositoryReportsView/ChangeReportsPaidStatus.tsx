import { useEditReport } from "@/hooks/useEditReport";
import { useRepositoryReportsStore } from "@/store/repositoryReportsOrders";
import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import toast from "react-hot-toast";

export const ChangeReportsPaidStatus = () => {
    const [opened, { open, close }] = useDisclosure(false);
    const { repositoryReportsOrders, deleteAllRepositoryReportsOrders } = useRepositoryReportsStore();
    const { mutateAsync: changeReportStatus, isLoading } = useEditReport();

    const handleDelete = async () => {
        await Promise.all(
            repositoryReportsOrders.map(async (order) => {
                await changeReportStatus({
                    status: order.status === "PAID" ? "UNPAID" : "PAID",
                    id: Number(order.id)
                });
            })
        );

        toast.success("تم تعديل حالة الكشوفات بنجاح");
        deleteAllRepositoryReportsOrders();
        close();
    };

    return (
        <>
            <Modal opened={opened} onClose={close} title="تعديل حالة الكشوفات" centered>
                هل انت متأكد من تعديل حالة الكشوفات؟
                <div className="mt-4 flex items-center gap-4">
                    <Button loading={isLoading} disabled={isLoading} variant="filled" onClick={handleDelete}>
                        تعديل
                    </Button>
                    <Button variant="outline" onClick={close} className="mr-4">
                        إلغاء
                    </Button>
                </div>
            </Modal>

            <Button disabled={repositoryReportsOrders.length === 0} variant="filled" onClick={open}>
                تغير حالة الكشوفات المحددة
            </Button>
        </>
    );
};
