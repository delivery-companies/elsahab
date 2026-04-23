import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useChangeOrderStatus } from "@/hooks/useChangeOrderStatus";
import { type orderStatusArabicNames, orderStatusArray } from "@/lib/orderStatusArabicNames";
import { useAuth } from "@/store/authStore";
import { Button, Modal } from "@mantine/core";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Props {
    id: string;
    opened: boolean;
    close: () => void;
    open: () => void;
    status: keyof typeof orderStatusArabicNames;
    closeMenu: () => void;
}

type OrderStatusItem = {
    label: string;
    value: string;
};

export const ChangeOrderStatus = ({ id, close, open, opened, status, closeMenu }: Props) => {
    const{orderStatus:userOrderStatus}=useAuth()
    const [orderStatus, setOrderStatus] = useState<keyof typeof orderStatusArabicNames | undefined>(status);
    const [allowedOrderStatus, setAllowedStatus] = useState<OrderStatusItem[]>([]);
    const { mutate: changeStatus, isLoading } = useChangeOrderStatus();

    useEffect(() => {
        let newStatuses: OrderStatusItem[] = [];
        if (userOrderStatus) {
            userOrderStatus.forEach(e => {
                const found = orderStatusArray.find(status => status.value === e);
                if (found) newStatuses.push(found);
            });
        }
        setAllowedStatus(newStatuses);
    }, []);

    const handleClose = () => {
        close();
        closeMenu();
    };

    const handleChangeStatus = () => {
        if (!orderStatus) {
            return;
        }
        changeStatus(
            {
                id,
                data: { status: orderStatus }
            },
            {
                onSuccess: () => {
                    toast.success("تم تعديل حالة الطلب بنجاح");
                    handleClose();
                }
            }
        );
    };

    return (
        <>
            <Modal opened={opened} onClose={handleClose} title="تعديل حالة الطلب" centered>
                <Card>
                    <CardHeader>
                        <CardTitle>تعديل حالة الطلب</CardTitle>
                        <CardDescription>يمكنك تعديل حالة الطلب من هنا</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        {allowedOrderStatus.map((status) => (
                            <div key={status.value} className="flex items-center justify-between space-x-2">
                                <Label htmlFor="necessary" className="flex flex-col space-y-1">
                                    <span>{status.label}</span>
                                </Label>
                                <Switch
                                    id="necessary"
                                    checked={status.value === orderStatus}
                                    onCheckedChange={(value) => {
                                        setOrderStatus(
                                            value
                                                ? (status.value as keyof typeof orderStatusArabicNames)
                                                : undefined
                                        );
                                    }}
                                />
                            </div>
                        ))}
                    </CardContent>
                    <CardFooter>
                        <Button
                            loading={isLoading}
                            disabled={isLoading}
                            variant="outline"
                            className="w-full"
                            onClick={handleChangeStatus}
                        >
                            تعديل الحالة
                        </Button>
                    </CardFooter>
                </Card>
            </Modal>

            <Button className="mb-2" fullWidth variant="outline" onClick={open}>
                تعديل الحالة
            </Button>
        </>
    );
};
