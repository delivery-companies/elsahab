import { useActivateReport } from "@/hooks/useActivateReport";
import { governorateArabicNames } from "@/lib/governorateArabicNames ";
import { reportStatusArabicNames } from "@/lib/reportStatusArabicNames";
import { reportTypeArabicNames } from "@/lib/reportTypeArabicNames";
import type { Report as IReport } from "@/services/getReports";
import { ActionIcon } from "@mantine/core";
import { IconRotate } from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import Arabic from "date-fns/locale/ar-EG";
import { PermanentlyDeleteReport } from "./PermanentlyDeleteReport";

export const columns: ColumnDef<IReport>[] = [
    {
        accessorKey: "id",
        header: "رقم الكشف"
    },
    {
        accessorKey: "createdBy.name",
        header: "الناشئ"
    },
    {
        accessorKey: "status",
        header: "الحالة",
        accessorFn: ({ status }) => {
            return reportStatusArabicNames[status];
        }
    },
    {
        accessorKey: "confirm",
        header: "التأكيد",
        accessorFn: ({ confirmed }) => {
            return confirmed ? "تم التأكيد" : "لم يتم التأكيد";
        }
    },
    {
        accessorKey: "baghdadOrdersCount",
        header: "عدد الطلبات في بغداد"
    },
    {
        accessorKey: "governoratesOrdersCount",
        header: "طلبات المحافظات"
    },
    {
        accessorKey: "createdAt",
        header: "تاريخ الإنشاء",
        accessorFn: ({ createdAt }) => {
            const stringToDate = parseISO(createdAt);
            const formattedDate = format(stringToDate, "dd/MM/yyyy HH:mm a", {
                locale: Arabic
            });
            return formattedDate;
        }
    },
    {
        accessorKey: "deletedAt",
        header: "تاريخ الحذف",
        accessorFn: ({ deletedAt }) => {
            if (deletedAt) {
                const stringToDate = parseISO(deletedAt);
                const formattedDate = format(stringToDate, "dd/MM/yyyy HH:mm");
                return formattedDate;
            }
            return "لا يوجد";
        }
    },
    {
        accessorKey: "deletedBy.name",
        header: "محذوف من قبل"
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
            repositoryReport
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
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const { id } = row.original;

            // eslint-disable-next-line react-hooks/rules-of-hooks
            const { mutate: activate } = useActivateReport();

            const handleActivate = () => {
                activate(id);
            };

            return (
                <div className="flex justify-center gap-5">
                    <PermanentlyDeleteReport id={id} />
                    <ActionIcon variant="filled" onClick={handleActivate} color="green" aria-label="Settings">
                        <IconRotate />
                    </ActionIcon>
                </div>
            );
        }
    }
];
