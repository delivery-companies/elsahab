import { useEditOrder } from "@/hooks/useEditOrder";
import { useOrdersStore } from "@/store/ordersStore";
import { Button } from "@mantine/core";

interface ProcessedSelectedOrdersProps {
    proceedValue: boolean;
}

export const ProcessedSelectedOrders = ({ proceedValue }: ProcessedSelectedOrdersProps) => {
    const { orders: selectedOrders, deleteAllOrders } = useOrdersStore();

    const { mutateAsync: proceedOrder, isLoading } = useEditOrder();

    const handleProceed = async () => {
        await Promise.all(
            selectedOrders.map(async (order) => {
                await proceedOrder({
                    id: order.id,
                    data: {
                        processed: proceedValue
                    }
                });
            })
        );
        deleteAllOrders();
    };

    return (
        <Button
            disabled={selectedOrders.length === 0 || isLoading}
            loading={isLoading}
            variant="filled"
            onClick={handleProceed}
            style={{flexGrow:"1"}}
        >
            {proceedValue ? "معالجة المحدد" : "إلغاء معالجة المحدد"}
        </Button>
    );
};
