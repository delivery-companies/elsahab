import { Button } from "@/components/ui/button";
import { useReportsPDF } from "@/hooks/useReportsPDF";
import { governorateArabicNames } from "@/lib/governorateArabicNames ";
import { reportStatusArabicNames } from "@/lib/reportStatusArabicNames";
import { reportTypeArabicNames } from "@/lib/reportTypeArabicNames";
import type { Report as IReport } from "@/services/getReports";
import { ActionIcon, Menu } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconFileTypePdf } from "@tabler/icons-react";
/* eslint-disable react-hooks/rules-of-hooks */
import type { ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import Arabic from "date-fns/locale/ar-EG";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { ChangeReportStatus } from "./ChangeReportStatus";
import { DeleteReport } from "./DeleteReport";
// import { ChangeReportRepository } from "./ChangeReportRepository";

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
    accessorKey: "repositoryReport.repository.name",
    header: "المخزن",
    accessorFn: ({ repositoryReport }) => {
      return repositoryReport?.repository.name || "";
    },
  },
  {
    accessorKey: "repositoryReport.targetRepositoryName",
    header: "المخزن المرسل اليه",
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
        <ActionIcon variant="filled" onClick={handleDownload}>
          <IconFileTypePdf />
        </ActionIcon>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id, status } = row.original;

      const [isMenuOpen, setMenuOpen] = useState(false);

      const [changeRepositoryOpened] = useDisclosure(false);

      return (
        <Menu
          zIndex={150}
          opened={isMenuOpen}
          onChange={() => {
            if (changeRepositoryOpened) return;
            setMenuOpen(!isMenuOpen);
          }}
        >
          <Menu.Target>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <DeleteReport id={id} />
            {/* <ChangeReportRepository
                            opened={changeRepositoryOpened}
                            close={closeChangeRepository}
                            open={openChangeRepository}
                            setMenuOpen={setMenuOpen}
                            id={id}
                        /> */}
            <ChangeReportStatus initialStatus={status} id={id} />
          </Menu.Dropdown>
        </Menu>
      );
    },
  },
];
