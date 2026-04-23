import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { DeleteDepartment } from "./DeleteDepartment";
import { Department } from "@/services/departments";
import { EditableTableCell } from "./EditableTableCell";
import { AssignInquiryEmployeeDepartment } from "./DepartmentEmployees";
import { useDisclosure } from "@mantine/hooks";

export const columns: ColumnDef<Department>[] = [
    {
        accessorKey: "id",
        header: "#"
    },
    {
        accessorKey: "name",
        header: "الاسم",
        cell: ({ row }) => {
                return (
                    <EditableTableCell
                        id={row.original.id}
                        type="name"
                        value={row.original.name}
                        typeOfValue="string"
                    />
                );
            }
    },
    {
        accessorKey: "createdBy",
        header: "أنشئ بواسطة"
    },
    {
        header: "الموظفين",
        cell: ({ row }) => {
            const { id,employees } = row.original;
            const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false);
            const stringifiedManagedStores = employees.map((store) => store.user.id.toString());
            return <AssignInquiryEmployeeDepartment 
                        opened={deleteOpened}
                        close={closeDelete}
                        open={openDelete}
                        id={id} 
                        managedEmployees={stringifiedManagedStores} 
                    />;
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const department = row.original;
            return (
                <DropdownMenu dir="rtl">
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center">
                        <DeleteDepartment id={department.id} />
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }
    }
];
