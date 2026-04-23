import { Button, buttonVariants } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Repository } from "@/services/getRepositoriesService";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { DeleteRepository } from "./delete-repository";

export const columns: ColumnDef<Repository>[] = [
    {
        accessorKey: "id",
        header: "#"
    },
    {
        accessorKey: "name",
        header: "الاسم"
    },
    {
        accessorKey: "branch.name",
        header: "الفرع"
    },
    {
        accessorKey: "branch.type",
        header: "نوع المخزن",
        cell:({row})=>{
            const {type,mainRepository}=row.original
            if(type === "EXPORT"){
                return mainRepository ? " مخزن فرز رئيسي" :" مخزن فرز فرعي"
            }else{
                return mainRepository ? " مخزن راجع رئيسي" :" مخزن راجع فرعي"
            }
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const { id } = row.original;
            return (
                <DropdownMenu dir="rtl">
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center">
                        <Link
                            className={buttonVariants({
                                variant: "ghost",
                                className: "w-full"
                            })}
                            to={`/repositories/${id}/show`}
                        >
                            عرض
                        </Link>
                        <Link
                            className={buttonVariants({
                                variant: "ghost",
                                className: "w-full"
                            })}
                            to={`/repositories/${id}/edit`}
                        >
                            تعديل
                        </Link>
                        <DeleteRepository repositoryId={id} />
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }
    }
];
