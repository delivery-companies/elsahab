import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useReportsPDF } from "@/hooks/useReportsPDF";
import { governorateArabicNames } from "@/lib/governorateArabicNames ";
import { reportStatusArabicNames } from "@/lib/reportStatusArabicNames";
import { reportTypeArabicNames } from "@/lib/reportTypeArabicNames";
// import { governorateArabicNames } from '@/lib/governorateArabicNames ';
import type { Report as IReport } from "@/services/getReports";
import { ActionIcon } from "@mantine/core";
import { IconFileTypePdf } from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import Arabic from "date-fns/locale/ar-EG";
import { MoreHorizontal } from "lucide-react";
import toast from "react-hot-toast";
import { ChangeReportStatus } from "../../ChangeReportStatus";
import { DeleteReport } from "../../DeleteReport";

export const columns: ColumnDef<IReport>[] = [
  {
    accessorKey: "id",
    header: "رقم الكشف",
  },
  {
    accessorKey: "createdBy.name",
    header: "الناشئ",
  },
  {
    accessorKey: "governorateReport?.governorate",
    header: "المحافظة",
    accessorFn: ({ governorateReport }) => {
      const governorate = governorateReport?.governorate ?? "";
      return (
        governorateArabicNames[
          governorate as keyof typeof governorateArabicNames
        ] || ""
      );
    },
  },
  {
    accessorKey: "baghdadOrdersCount",
    header: "عدد الطلبات في بغداد",
  },
  {
    accessorKey: "governoratesOrdersCount",
    header: "طلبات المحافظات",
  },
  {
    accessorKey: "governorateReport.baghdadDeliveryCost",
    header: "أجور توصيل بغداد",
  },
  {
    accessorKey: "governorateReport.governoratesDeliveryCost",
    header: "أجور توصيل المحافظات",
  },
  {
    accessorKey: "totalCost",
    header: "المبلغ الكلي",
  },
  {
    accessorKey: "paidAmount",
    header: "المبلغ المستلم",
  },
  {
    accessorKey: "deliveryCost",
    header: "مبلغ التوصيل",
  },
  {
    accessorKey: "deliveryAgentNet",
    header: "صافي المندوب",
  },
  {
    accessorKey: "companyNet",
    header: "صافى الشركه",
  },
  {
    accessorKey: "status",
    header: "الحالة",
    accessorFn: ({ status }) => {
      return reportStatusArabicNames[status];
    },
  },
  {
    accessorKey: "confirm",
    header: "التأكيد",
    accessorFn: ({ confirmed }) => {
      return confirmed ? "تم التأكيد" : "لم يتم التأكيد";
    },
  },
  {
    accessorKey: "createdAt",
    header: "تاريخ الإنشاء",
    accessorFn: ({ createdAt }) => {
      const stringToDate = parseISO(createdAt);
      const formattedDate = format(stringToDate, "dd/MM/yyyy HH:mm a", {
        locale: Arabic,
      });
      return formattedDate;
    },
  },
  {
    header: "الملف",
    cell: ({ row }) => {
      const {
        id,
        branchReport,
        clientReport,
        deliveryAgentReport,
        governorateReport,
        repositoryReport,
        type,
        url,
      } = row.original;

      const reportNameMap: Record<IReport["type"], string> = {
        REPOSITORY: repositoryReport?.repository.name || "",
        BRANCH: branchReport?.branch.name || "",
        CLIENT: clientReport?.client.name || "",
        DELIVERY_AGENT: deliveryAgentReport?.deliveryAgent.name || "",
        GOVERNORATE:
          (governorateReport &&
            governorateArabicNames[governorateReport?.governorate]) ||
          "",
        COMPANY: "",
      } as const;

      const pdfTitle = `${reportNameMap[type]} - ${reportTypeArabicNames[type]}`;

      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { mutateAsync: getReportPDF } = useReportsPDF(pdfTitle);

      const handleClick = () => {
        // ✅ Already generated → open in new tab
        if (url) {
          window.open(url, "_blank");
          return;
        }

        // ❌ Not generated yet → generate & download
        toast.promise(getReportPDF(id), {
          loading: "جاري تحميل الكشف...",
          success: "تم تحميل الكشف بنجاح",
          error: (error) => error.message || "حدث خطأ ما",
        });
      };

      return (
        <ActionIcon
          variant="filled"
          color={url ? "red" : "red"}
          onClick={handleClick}
          title={url ? "فتح الملف" : "إنشاء وتحميل الملف"}>
          <IconFileTypePdf size={18} />
        </ActionIcon>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id, status } = row.original;

      return (
        <DropdownMenu dir="rtl">
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            <DeleteReport id={id} />
            <ChangeReportStatus initialStatus={status} id={id} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
