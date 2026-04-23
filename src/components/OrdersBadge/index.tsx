import { orderStatusArabicNames } from "@/lib/orderStatusArabicNames";
import { Badge } from "@mantine/core";

interface Props {
  status: keyof typeof orderStatusArabicNames;
  secondaryStatus: string;
  repositoryname: string | undefined;
}

export const OrdersBadge = ({
  status,
  repositoryname,
  secondaryStatus,
}: Props) => {
  const mapOrderStatusToColor: Record<
    keyof typeof orderStatusArabicNames,
    string
  > = {
    REGISTERED: "#FFFFFF",
    READY_TO_SEND: "#FFFFFF",
    WITH_DELIVERY_AGENT: "#FFFFFF",
    DELIVERED: "#228B22",
    REPLACED: "#00BFFF",
    PARTIALLY_RETURNED: "#FF4500",
    POSTPONED: "#B8860B",
    CHANGE_ADDRESS: "#8B008B",
    RETURNED: "#FF0000",
    RESEND: "#FFFF00",
    WITH_RECEIVING_AGENT: "#FFFF00",
    IN_MAIN_REPOSITORY: "#FFFF00",
    IN_GOV_REPOSITORY: "#FFFF00",
    PROCESSING: "#FFA500",
  };

  return (
    <Badge
      styles={{
        root: {
          height: "fit-content",
          overflow: "visible",
          textOverflow: "unset",
          borderRadius: "5px",
        },
        label: {
          color: "black",
          minWidth: "150px",
          whiteSpace: "wrap",
          padding: "5px 0",
        },
      }}
      size="md"
      color={mapOrderStatusToColor[status]}>
      {secondaryStatus === "IN_REPOSITORY" &&
      (status === "IN_GOV_REPOSITORY" || status === "IN_MAIN_REPOSITORY")
        ? "في " + repositoryname
        : secondaryStatus === "IN_REPOSITORY"
        ? orderStatusArabicNames[status] + " " + "في " + repositoryname
        : secondaryStatus === "IN_CAR"
        ? "مرسل إلي " + repositoryname
        : secondaryStatus === "WITH_AGENT" &&
          status !== "WITH_DELIVERY_AGENT" &&
          status !== "WITH_RECEIVING_AGENT"
        ? orderStatusArabicNames[status] + "-" + "مع المندوب"
        : secondaryStatus === "WITH_CLIENT"
        ? orderStatusArabicNames[status] + "-" + "مع العميل"
        : secondaryStatus === "WITH_RECEIVING_AGENT"
        ? orderStatusArabicNames[status] + "-" + "مع مندوب الاستلام"
        : orderStatusArabicNames[status]}
    </Badge>
  );
};
