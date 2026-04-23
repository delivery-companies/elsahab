/* eslint-disable react-hooks/rules-of-hooks */
import type { ColumnDef } from "@tanstack/react-table";
import { CompanyNetReport } from "@/services/getTransactionsService";

export const columns: ColumnDef<CompanyNetReport>[] = [
  {
    accessorKey: "employeeId",
    header: "#",
  },
  {
    accessorKey: "employeeName",
    header: "اسم الموظف",
  },
  {
    accessorKey: "",
    header: "رصيد المحفظه",
    accessorFn: ({ totalCompanyNet, totalDeposit, totalWithdraw }) => {
      let total = totalCompanyNet + totalWithdraw;
      total = total - totalDeposit;
      return total.toLocaleString();
    },
  },
  {
    accessorKey: "totalCompanyNet",
    header: "المبلغ المستلم من المناديب",
    accessorFn: ({ totalCompanyNet }) => {
      return totalCompanyNet.toLocaleString();
    },
  },
  {
    accessorKey: "totalDeposit",
    header: "اجمالي ما تم توريده الي الخزنه",
    accessorFn: ({ totalDeposit }) => {
      return totalDeposit.toLocaleString();
    },
  },
  {
    accessorKey: "totalWithdraw",
    header: "اجمالي ما تم سحبه من الخزنه",
    accessorFn: ({ totalWithdraw }) => {
      return totalWithdraw.toLocaleString();
    },
  },
];
