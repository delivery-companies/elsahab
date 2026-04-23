import { governorateArabicNames } from "@/lib/governorateArabicNames ";
import type { Order } from "@/services/getOrders";
import { ActionIcon, Card, Grid, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowsMaximize } from "@tabler/icons-react";
import { format, parseISO } from "date-fns";
import Arabic from "date-fns/locale/ar-EG";

interface OrdersFullDetailsProps {
    order: Order;
}

const OrderDetailCard = ({
    title,
    value
}: {
    title: string;
    value?: string;
}) => (
    <Card withBorder radius="md" padding="xl" bg="var(--mantine-color-body)">
        <div className="flex w-full gap-1">
            <Text fz="lg" fw={700}>
                {title}:{" "}
            </Text>
            <Text fz="lg" fw={400}>
                {value || "لا يوجد"}
            </Text>
        </div>
    </Card>
);

export const OrdersFullDetails = ({ order }: OrdersFullDetailsProps) => {
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <>
            <Modal size="auto" opened={opened} onClose={close} title="تفاصيل الطلب" centered>
                <Grid grow gutter="sm">
                    <Grid.Col span={{ sm: 6, xs: 12, md: 4, lg: 3 }}>
                        <OrderDetailCard
                            title="المندوب"
                            value={order?.deliveryAgent?.name || "لا يوجد مندوب"}
                        />
                    </Grid.Col>

                    {order.deliveryAgent && (
                        <Grid.Col span={{ sm: 6, xs: 12, md: 4, lg: 3 }}>
                            <OrderDetailCard title="رقم المندوب" value={order.deliveryAgent.phone} />
                        </Grid.Col>
                    )}
                    <Grid.Col span={{ sm: 6, xs: 12, md: 4, lg: 3 }}>
                        <OrderDetailCard title="الوزن" value={order.weight.toString()} />
                    </Grid.Col>
                    <Grid.Col span={{ sm: 6, xs: 12, md: 4, lg: 3 }}>
                        <OrderDetailCard
                            title="عنوان المستلم"
                            value={`${governorateArabicNames[order.governorate]}${" "}
              ${order.recipientAddress && `- ${order.recipientAddress}`}
                `}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ sm: 6, xs: 12, md: 4, lg: 3 }}>
                        <OrderDetailCard title="اسم المستلم" value={order.recipientName} />
                    </Grid.Col>
                    <Grid.Col span={{ sm: 6, xs: 12, md: 4, lg: 3 }}>
                        <OrderDetailCard title="مبلغ التوصيل" value={order.deliveryCost.toString()} />
                    </Grid.Col>
                    <Grid.Col span={{ sm: 6, xs: 12, md: 4, lg: 3 }}>
                        <OrderDetailCard title="المتجر" value={order.store.name} />
                    </Grid.Col>
                    <Grid.Col span={{ sm: 6, xs: 12, md: 4, lg: 3 }}>
                        <OrderDetailCard title="الفرع" value={order?.branch?.name} />
                    </Grid.Col>
                    <Grid.Col span={{ sm: 6, xs: 12, md: 4, lg: 3 }}>
                        <OrderDetailCard title="العميل" value={order.client.name} />
                    </Grid.Col>
                    <Grid.Col span={{ sm: 6, xs: 12, md: 4, lg: 3 }}>
                        <OrderDetailCard
                            title="أرقام الهاتف"
                            value={order.recipientPhones.map((phone) => phone).join(", ")}
                        />
                    </Grid.Col>
                    {order.deliveryAgent && (
                        <Grid.Col span={{ sm: 6, xs: 12, md: 4, lg: 3 }}>
                            <OrderDetailCard title="صافي المندوب" value={order.deliveryAgent.deliveryCost} />
                        </Grid.Col>
                    )}
                    <Grid.Col span={{ sm: 6, xs: 12, md: 4, lg: 3 }}>
                        <OrderDetailCard title="التفاصيل" value={order.details || "لا يوجد تفاصيل"} />
                    </Grid.Col>
                    <Grid.Col span={{ sm: 6, xs: 12, md: 4, lg: 3 }}>
                        <OrderDetailCard title="ملاحظات" value={order.notes || "لا يوجد تفاصيل"} />
                    </Grid.Col>
                    <Grid.Col span={{ sm: 6, xs: 12, md: 4, lg: 3 }}>
                        <OrderDetailCard title="الكمية" value={order.quantity.toString()} />
                    </Grid.Col>
                    <Grid.Col span={{ sm: 6, xs: 12, md: 4, lg: 3 }}>
                        <OrderDetailCard title="صافي العميل" value={order.clientNet} />
                    </Grid.Col>
                    <Grid.Col span={{ sm: 6, xs: 12, md: 6, lg: 4 }}>
                        <OrderDetailCard
                            title="تم الانشاء في"
                            value={format(parseISO(order.createdAt), "dd/MM/yyyy HH:mm a", {
                                locale: Arabic
                            })}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ sm: 6, xs: 12, md: 6, lg: 4 }}>
                        <OrderDetailCard title="معالج" value={order.processed ? "نعم" : "لا"} />
                    </Grid.Col>
                    <Grid.Col span={{ sm: 6, xs: 12, md: 6, lg: 4 }}>
                        <OrderDetailCard title="معالج من قبل" value={order.processedBy?.name || "لا يوجد"} />
                    </Grid.Col>
                    {order?.processedAt && (
                        <Grid.Col span={{ sm: 6, xs: 12, md: 6, lg: 4 }}>
                            <OrderDetailCard
                                title="تم المعالجة في"
                                value={format(parseISO(order.processedAt), "dd/MM/yyyy HH:mm a", {
                                    locale: Arabic
                                })}
                            />
                        </Grid.Col>
                    )}
                    <Grid.Col span={{ sm: 6, xs: 12, md: 6, lg: 4 }}>
                        <OrderDetailCard
                            title="تم التعديل في"
                            value={format(parseISO(order.updatedAt), "dd/MM/yyyy HH:mm a", {
                                locale: Arabic
                            })}
                        />
                    </Grid.Col>
                </Grid>
            </Modal>

            <ActionIcon c="blue" size="sm" variant="subtle" onClick={open}>
                <IconArrowsMaximize />
            </ActionIcon>
        </>
    );
};
