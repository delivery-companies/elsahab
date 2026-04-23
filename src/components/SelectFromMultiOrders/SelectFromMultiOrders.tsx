import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { governorateArabicNames } from "@/lib/governorateArabicNames ";
// import { orderSecondaryStatusArabicNames } from "@/lib/orderSecondaryStatusArabicNames";
import { orderStatusArabicNames } from "@/lib/orderStatusArabicNames";
import { Order } from "@/services/getOrders";
import { Button, Modal, Radio, Group } from "@mantine/core";
import { useState } from "react";

interface Props {
  opened: boolean;
  close: () => void;
  open: () => void;
  confirm: (receiptNumber: string) => void;
  orders: Order[];
  loading: boolean;
}

export const ConfirmOrderNumber = ({
  close,
  opened,
  confirm,
  orders,
  loading,
}: Props) => {
  const [receiptNumber, setReceiptNumber] = useState<string | undefined>(
    undefined
  );

  const handleClose = () => {
    close();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="تأكيد رقم الطلب"
      centered
      size="lg">
      <Card>
        <CardHeader>
          <CardTitle>
            رقم الوصل متكرر - {orders[0]?.receiptNumber || ""}
          </CardTitle>
          <CardDescription>اختر الطلب الصحيح لتأكيده</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Radio.Group
            value={receiptNumber}
            onChange={setReceiptNumber}
            name="selectedOrder">
            <div className="flex flex-col gap-4">
              {orders.map((order) => {
                const formattedNumber = order.totalCost
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                const date = new Date(order.createdAt);
                return (
                  <Card
                    key={order.id}
                    className={`border ${
                      receiptNumber === order.id
                        ? "border-blue-500 shadow-md"
                        : "border-gray-200"
                    }`}>
                    <CardContent className="p-3">
                      <Group align="center">
                        <Radio
                          value={order.id}
                          label={
                            <div>
                              <p className="font-medium text-base">
                                {`${
                                  order.secondaryStatus === "IN_REPOSITORY" &&
                                  (order.status === "IN_GOV_REPOSITORY" ||
                                    order.status === "IN_MAIN_REPOSITORY")
                                    ? "في " + order.repository?.name
                                    : order.secondaryStatus === "IN_REPOSITORY"
                                    ? orderStatusArabicNames[order.status] +
                                      " " +
                                      "في " +
                                      order.repository?.name
                                    : order.secondaryStatus === "IN_CAR"
                                    ? "مرسل إلي " + order.repository?.name
                                    : order.secondaryStatus === "WITH_AGENT" &&
                                      order.status !== "WITH_DELIVERY_AGENT" &&
                                      order.status !== "WITH_RECEIVING_AGENT"
                                    ? orderStatusArabicNames[order.status] +
                                      "-" +
                                      "مع المندوب"
                                    : order.secondaryStatus === "WITH_CLIENT"
                                    ? orderStatusArabicNames[order.status] +
                                      "-" +
                                      "مع العميل"
                                    : orderStatusArabicNames[order.status]
                                }`}{" "}
                                - {date.toLocaleString()}
                              </p>
                              <p className="text-md">
                                العميل : {order.client.name} |{" "}
                                {order.store.name}
                              </p>
                              <p className="text-md">
                                السعر الكلي : {formattedNumber}
                              </p>
                              <p className="text-md">
                                {governorateArabicNames[order.governorate]} -{" "}
                                {order.location?.name} -{" "}
                                {order.recipientAddress}
                              </p>
                            </div>
                          }
                        />
                      </Group>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </Radio.Group>
        </CardContent>

        <CardFooter>
          <Button
            loading={loading}
            disabled={!receiptNumber}
            variant="outline"
            className="w-full"
            onClick={() => {
              if (receiptNumber) {
                confirm(receiptNumber);
                setReceiptNumber(undefined);
              }
            }}>
            تأكيد
          </Button>
        </CardFooter>
      </Card>
    </Modal>
  );
};
