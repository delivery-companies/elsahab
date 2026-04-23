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
import type { Report as IReport } from "@/services/getReports";
import { ActionIcon, HoverCard, Text, rem } from "@mantine/core";
import { IconFileTypePdf } from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import Arabic from "date-fns/locale/ar-EG";
import { MoreHorizontal } from "lucide-react";
import toast from "react-hot-toast";
import { ChangeReportStatus } from "./components/ChangeReportStatus";
import { DeleteReport } from "./components/DeleteReport";

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
    accessorKey: "clientReport.client.name",
    header: "اسم العميل",
    accessorFn: ({ clientReport }) => {
      return clientReport?.client.name || "";
    },
  },
  {
    accessorKey: "type",
    header: "النوع",
    accessorFn: ({
      type,
      branchReport,
      clientReport,
      companyReport,
      deliveryAgentReport,
      governorateReport,
      repositoryReport,
    }) => {
      return `${reportTypeArabicNames[type]} - ${(() => {
        switch (type) {
          case "BRANCH":
            return branchReport?.branch.name;
          case "CLIENT":
            return clientReport?.client.name;
          case "COMPANY":
            return companyReport?.company.name;
          case "DELIVERY_AGENT":
            return deliveryAgentReport?.deliveryAgent.name;
          case "GOVERNORATE":
            return governorateReport?.governorate
              ? governorateArabicNames[governorateReport.governorate]
              : "";
          case "REPOSITORY":
            return repositoryReport?.repository.name;
          default:
            return "";
        }
      })()}`;
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
    id: "actions",
    cell: ({ row }) => {
      const {
        id,
        branchReport,
        clientReport,
        deliveryAgentReport,
        governorateReport,
        repositoryReport,
        type,
        status,
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

      const handleDownload = () => {
        toast.promise(getReportPDF(id), {
          loading: "جاري تحميل الكشف...",
          success: "تم تحميل الكشف بنجاح",
          error: (error) => error.message || "حدث خطأ ما",
        });
      };

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
            <div className="flex justify-center">
              <HoverCard width={rem(120)} shadow="md">
                <HoverCard.Target>
                  <ActionIcon variant="filled" onClick={handleDownload}>
                    <IconFileTypePdf />
                  </ActionIcon>
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <Text size="sm">تحميل الكشف</Text>
                </HoverCard.Dropdown>
              </HoverCard>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
