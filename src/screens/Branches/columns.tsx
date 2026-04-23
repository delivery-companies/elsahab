import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mapEnumToArabic } from "@/lib/mapGovernateEnumToArabic";
import type { Branch } from "@/services/getBranchesService";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { DeleteBranch } from "./DeleteBranch";

export const columns: ColumnDef<Branch>[] = [
  {
    accessorKey: "id",
    header: "#",
  },
  {
    accessorKey: "name",
    header: "الاسم",
  },
  {
    accessorFn: (row) => {
      return mapEnumToArabic(row.governorate as keyof typeof mapEnumToArabic);
    },
    accessorKey: "governorate",
    header: "المحافظة",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const branch = row.original;
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
                className: "w-full",
              })}
              to={`/branches/${branch.id}/show`}>
              عرض
            </Link>
            <Link
              className={buttonVariants({
                variant: "ghost",
                className: "w-full",
              })}
              to={`/branches/${branch.id}/edit`}>
              تعديل
            </Link>
            <DeleteBranch branchId={branch.id} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
