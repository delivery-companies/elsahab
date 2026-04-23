import { useActivateEmployee } from "@/hooks/useActivateEmployee";
import { rolesArabicNames } from "@/lib/rolesArabicNames";
import type { Employee } from "@/services/getEmployeesService";
import { ActionIcon, Avatar } from "@mantine/core";
import { IconRotate } from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { PermanentlyDeleteReport } from "./PermanentlyDeleteReport";

export const columns: ColumnDef<Employee>[] = [
    {
        accessorKey: "id",
        header: "#"
    },
    {
        accessorKey: "avatar",
        header: "الصورة",
        cell: ({ row }) => {
            const employee = row.original;
            return <Avatar src={employee.avatar} size="lg" />;
        }
    },
    {
        accessorKey: "name",
        header: "الاسم"
    },
    {
        accessorKey: "username",
        header: "اسم المستخدم"
    },
    {
        accessorKey: "phone",
        header: "رقم الهاتف"
    },
    {
        accessorKey: "role",
        header: "الوظيفة",
        accessorFn: ({ role }) => {
            return rolesArabicNames[role];
        }
    },
    {
        accessorKey: "branch",
        header: "الفرع",
        accessorFn: ({ branch }) => {
            return branch?.name ?? "لا يوجد";
        }
    },
    {
        accessorKey: "repository",
        header: "المخزن",
        accessorFn: ({ repository }) => {
            return repository?.name ?? "لا يوجد";
        }
    },
    {
        accessorKey: "deletedAt",
        header: "تاريخ الحذف",
        accessorFn: ({ deletedAt }) => {
            if (deletedAt) {
                return format(parseISO(deletedAt), "dd/MM/yyyy HH:mm");
            }
            return "لا يوجد";
        }
    },
    {
        accessorKey: "deletedBy.name",
        header: "محذوف من قبل"
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const employee = row.original;
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const { mutate: activate } = useActivateEmployee();

            const handleActivate = () => {
                activate(employee.id);
            };

            return (
                <div className="flex justify-center gap-5">
                    <PermanentlyDeleteReport id={employee.id} />
                    <ActionIcon variant="filled" onClick={handleActivate} color="green" aria-label="Settings">
                        <IconRotate />
                    </ActionIcon>
                </div>
            );
        }
    }
];
