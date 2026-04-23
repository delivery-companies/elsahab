/* eslint-disable no-case-declarations */
/* eslint-disable no-nested-ternary */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { orderStatusArabicNames } from "@/lib/orderStatusArabicNames";
import {
  IconCheck,
  IconCoin,
  IconFileXFilled,
  IconLocationFilled,
  IconMan,
  IconPdf,
  IconStatusChange,
} from "@tabler/icons-react";
import { reportTypeArabicNames } from "./reportTypeArabicNames";

export const orderTimelineTypeArabicNames = {
  STATUS_CHANGE: "تغيير حالة الطلب",
  DELIVERY_AGENT_CHANGE: "تغيير مندوب التوصيل",
  CURRENT_LOCATION_CHANGE: "تغيير الموقع الحالي",
  ORDER_DELIVERY: "توصيل الطلب",
  REPORT_CREATE: "إنشاء كشف",
  REPORT_DELETE: "حذف كشف",
  PAID_AMOUNT_CHANGE: "تغيير المبلغ المدفوع",
};

export const renderTimelineDescription = ({
  type,
  old,
  new: newStatus,
  by,
  message,
}) => {
  switch (type) {
    case "STATUS_CHANGE": {
      const hasNewStatus = !!newStatus;
      return `${message} بواسطة ${by.name}`;
    }
    case "CURRENT_LOCATION_CHANGE":
      return ` تم تغير موقع الطلب من ${old} الى ${newStatus} بواسطة ${by.name}`;
    case "ORDER_DELIVERY":
      return " تم توصيل الطلب بنجاح";
    case "PAID_AMOUNT_CHANGE":
      return old
        ? ` تم تغير مبلغ الطلب من ${old.value} الى ${newStatus.value} بواسطة ${by.name}`
        : ` تم تغير مبلغ الطلب الى ${newStatus.value} بواسطة ${by.name}`;
    case "REPORT_CREATE":
      return `تم انشاء كشف ${reportTypeArabicNames[newStatus.type]} بواسطة ${
        by.name
      }`;
    case "REPORT_DELETE":
      return ` تم حذف كشف  بواسطة ${by.name}`;
    case "REPOSITORY_CHANGE":
      return `${message} بواسطة ${by.name}`;
    case "BRANCH_CHANGE":
      return old
        ? ` تم تغيير الفرع من ${old.name} الى ${newStatus.name} بواسطة ${by.name}`
        : ` تم تغيير الفرع الى ${newStatus.name} بواسطة ${by.name}`;
    case "CLIENT_CHANGE":
      return ` تم تغيير العميل من ${old.name} الى ${newStatus.name} بواسطة ${by.name}`;
    case "OTHER":
      return message;
    default:
      return message || null;
  }
};

export const orderTimelineIcons = {
  STATUS_CHANGE: <IconStatusChange size={23} />,
  DELIVERY_AGENT_CHANGE: <IconMan size={23} />,
  CURRENT_LOCATION_CHANGE: <IconLocationFilled size={23} />,
  ORDER_DELIVERY: <IconCheck size={23} />,
  REPORT_CREATE: <IconPdf size={23} />,
  REPORT_DELETE: <IconFileXFilled size={23} />,
  PAID_AMOUNT_CHANGE: <IconCoin size={23} />,
  REPOSITORY_CHANGE: <IconMan size={23} />,
  BRANCH_CHANGE: <IconMan size={23} />,
  CLIENT_CHANGE: <IconMan size={23} />,
  OTHER: <IconMan size={23} />,
};
