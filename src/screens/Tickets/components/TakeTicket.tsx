import { useTakeTicket } from "@/hooks/useTicket";
import { Button, Modal } from "@mantine/core";

interface Props {
    id: number;
    opened: boolean;
    close: () => void;
}

export const TakeTicket = ({ id, close, opened }: Props) => {
    const { mutate: takeTicket, isLoading } = useTakeTicket();

    const handleClose = () => {
        close();
    };

    const handleTakeTicket = () => {
        takeTicket(id, {
            onSuccess: () => {
                handleClose();
            }
        });
    };

    return (
        <Modal opened={opened} onClose={handleClose} title="استلام التذاكره" centered>
            هل انت متأكد من استلام التذكره رقم {id} ؟
            <div className="mt-4 flex items-center gap-4">
                <Button loading={isLoading} disabled={isLoading} variant="outline" onClick={handleTakeTicket}>
                    تأكيد
                </Button>
                <Button variant="default" onClick={handleClose} className="mr-4">
                    إلغاء
                </Button>
            </div>
        </Modal>
    );
};
