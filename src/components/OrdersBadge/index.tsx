import { orderStatusArabicNames } from "@/lib/orderStatusArabicNames";
import { Badge } from "@mantine/core";

interface Props {
  status: keyof typeof orderStatusArabicNames;
  secondaryStatus: string;
  repositoryname?: string;
  company?: string;
}

const statusColors: Record<keyof typeof orderStatusArabicNames, string> = {
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

const getBadgeText = (
  status: keyof typeof orderStatusArabicNames,
  secondaryStatus: string,
  repositoryname?: string,
  company?: string,
) => {
  const statusName = orderStatusArabicNames[status];
  const repo = repositoryname || "";

  if (
    secondaryStatus === "SEND_TO_COMPANY" &&
    status !== "DELIVERED" &&
    status !== "REPLACED" &&
    status !== "PARTIALLY_RETURNED"
  ) {
    return `مرسل إلي ${company}`;
  }

  if (
    secondaryStatus === "IN_REPOSITORY" &&
    (status === "IN_GOV_REPOSITORY" || status === "IN_MAIN_REPOSITORY")
  ) {
    return `في ${repo}`;
  }

  if (secondaryStatus === "IN_REPOSITORY") {
    return `${statusName} في ${repo}`;
  }

  if (secondaryStatus === "IN_CAR") {
    return `مرسل إلي ${repo}`;
  }

  if (
    secondaryStatus === "WITH_AGENT" &&
    status !== "WITH_DELIVERY_AGENT" &&
    status !== "WITH_RECEIVING_AGENT"
  ) {
    return `${statusName}-مع المندوب`;
  }

  if (secondaryStatus === "WITH_CLIENT") {
    return `${statusName}-مع العميل`;
  }

  if (secondaryStatus === "WITH_RECEIVING_AGENT") {
    return `${statusName}-مع مندوب الاستلام`;
  }

  return statusName;
};

export const OrdersBadge = ({
  status,
  repositoryname,
  secondaryStatus,
  company,
}: Props) => {
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
      size="sm"
      color={statusColors[status]}>
      {getBadgeText(status, secondaryStatus, repositoryname, company)}
    </Badge>
  );
};
