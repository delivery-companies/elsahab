import { useDeactivateReport } from "@/hooks/useDeactivateReport";
import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import toast from "react-hot-toast";

export const DeleteReport = ({ id }: { id: number }) => {
    const [opened, { open, close }] = useDisclosure(false);
    const { mutate: deleteReport, isLoading } = useDeactivateReport();

    const handleDelete = () => {
        deleteReport(id, {
            onSuccess: () => {
                close();
                toast.success("تم مسح اضافة الكشف لقائمة المحذوفات بنجاح");
            }
        });
    };

    return (
        <>
            <Modal opened={opened} onClose={close} title="مسح الكشف" centered>
                هل انت متأكد من مسح الكشف؟
                <div className="mt-4 flex items-center gap-4">
                    <Button loading={isLoading} disabled={isLoading} variant="filled" onClick={handleDelete}>
                        مسح
                    </Button>
                    <Button variant="outline" onClick={close} className="mr-4">
                        إلغاء
                    </Button>
                </div>
            </Modal>

            <Button size="xs" className="mb-2" fullWidth variant="filled" onClick={open}>
                مسح
            </Button>
        </>
    );
};
