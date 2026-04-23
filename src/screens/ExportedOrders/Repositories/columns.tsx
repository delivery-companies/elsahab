import { Text } from "@mantine/core";
/* eslint-disable react-hooks/rules-of-hooks */
import type { ColumnDef } from "@tanstack/react-table";

import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";

export const columns: ColumnDef<{
  count: number;
  repositoryId: number | null;
  repoName: string | undefined;
}>[] = [
  {
    accessorKey: "",
    header: "#",
    cell: ({ row }) => {
      return <Text size="sm">{row.index + 1}</Text>;
    },
  },
  {
    accessorKey: "repoName",
    header: "المخزن",
  },
  {
    accessorKey: "count",
    header: "عدد الطلبات",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { repositoryId } = row.original;
      return (
        <Link
          style={{ cursor: "pointer" }}
          className={buttonVariants({
            variant: "default",
            className: "w-full",
          })}
          to={`/outcoming-orders?repo=${repositoryId}`}>
          عرض الطلبات
        </Link>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { repositoryId } = row.original;
      return (
        <Link
          style={{ cursor: "pointer" }}
          className={buttonVariants({
            variant: "default",
            className: "w-full",
          })}
          to={`/outcoming-orders?reportsRepo=${repositoryId}`}>
          عرض الكشوفات
        </Link>
      );
    },
  },
];
