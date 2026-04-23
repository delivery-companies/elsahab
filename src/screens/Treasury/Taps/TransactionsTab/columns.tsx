import { Text, rem } from "@mantine/core";
import { IconArrowDownLeft, IconArrowUpRight } from "@tabler/icons-react";
/* eslint-disable react-hooks/rules-of-hooks */
import type { ColumnDef } from "@tanstack/react-table";
import { Report } from "@/services/getReports";
import { useAuth } from "@/store/authStore";

export const columns: ColumnDef<Report>[] = [
  {
    accessorKey: "id",
    header: "رقم الكشف",
  },
  {
    accessorKey: "createdBy.name",
    header: "الناشئ",
  },
  {
    accessorKey: "type",
    header: "نوع المعامله",
    accessorFn: ({ type, branchReport }) => {
      const { role, mainRepository } = useAuth();

      if (role === "COMPANY_MANAGER" || mainRepository) {
        return type === "CLIENT"
          ? "سحب من القاصه"
          : type === "DELIVERY_AGENT"
          ? "ايداع داخل القاصه"
          : branchReport?.type === "received"
          ? "ايداع داخل القاصه"
          : "سحب من القاصه";
      }

      return type === "CLIENT"
        ? "سحب من القاصه"
        : type === "DELIVERY_AGENT"
        ? "ايداع داخل القاصه"
        : branchReport?.type === "received"
        ? "سحب من القاصه"
        : "ايداع داخل القاصه";
    },
  },
  {
    accessorKey: "type2",
    header: "نوع الكشف",
    accessorFn: ({ type, branchReport }) => {
      return type === "CLIENT"
        ? "كشف عميل"
        : type === "DELIVERY_AGENT"
        ? "كشف مندوب"
        : branchReport?.type === "received"
        ? "كشف فرع صادر"
        : "كشف فرع وارد";
    },
  },
  {
    header: "داخل / خارج",
    cell: ({ row }) => {
      const { role, mainRepository } = useAuth();

      const { type, branchReport, clientNet, companyNet, branchNet } =
        row.original;

      if (role === "COMPANY_MANAGER" || mainRepository) {
        const renderIcon =
          type === "CLIENT" || branchReport?.type === "forwarded" ? (
            <IconArrowDownLeft
              style={{ width: rem(30), height: rem(30), color: "red" }}
              stroke={1.5}
            />
          ) : (
            <IconArrowUpRight
              style={{ width: rem(30), height: rem(30), color: "green" }}
              stroke={1.5}
            />
          );

        return (
          <div className="flex items-center gap-2">
            {renderIcon}
            <Text
              size="sm"
              className="mx-2"
              c={
                type === "CLIENT" || branchReport?.type === "forwarded"
                  ? "red"
                  : "green"
              }>
              {type === "CLIENT"
                ? clientNet.toLocaleString()
                : type === "DELIVERY_AGENT"
                ? companyNet.toLocaleString()
                : branchNet.toLocaleString()}
            </Text>
          </div>
        );
      }

      const renderIcon =
        type === "CLIENT" || branchReport?.type === "received" ? (
          <IconArrowDownLeft
            style={{ width: rem(30), height: rem(30), color: "red" }}
            stroke={1.5}
          />
        ) : (
          <IconArrowUpRight
            style={{ width: rem(30), height: rem(30), color: "green" }}
            stroke={1.5}
          />
        );

      return (
        <div className="flex items-center gap-2">
          {renderIcon}
          <Text
            size="sm"
            className="mx-2"
            c={
              type === "CLIENT" || branchReport?.type === "received"
                ? "red"
                : "green"
            }>
            {type === "CLIENT"
              ? clientNet.toLocaleString()
              : type === "DELIVERY_AGENT"
              ? companyNet.toLocaleString()
              : branchNet.toLocaleString()}
          </Text>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "تاريخ الإنشاء",
    accessorFn: ({ createdAt }) => {
      const date = new Date(createdAt);
      return date.toLocaleString();
    },
  },
];
