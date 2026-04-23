import { Button, buttonVariants } from "@/components/ui/button";
/* eslint-disable react-hooks/rules-of-hooks */
import type { Employee } from "@/services/getEmployeesService";
import { Avatar, Menu } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { AssignClientAssistantToStores } from "./AssignClientAssistantToStores";
import { DeleteEmployee } from "./DeleteEmployee";

export const clientAssistantColumns: ColumnDef<Employee>[] = [
  {
    accessorKey: "id",
    header: "#",
  },
  {
    accessorKey: "avatar",
    header: "الصورة",
    cell: ({ row }) => {
      const employee = row.original;
      return <Avatar src={employee.avatar} size="lg" />;
    },
  },
  {
    accessorKey: "name",
    header: "الاسم",
  },
  {
    accessorKey: "phone",
    header: "رقم الهاتف",
  },
  {
    accessorKey: "clientAssistantRole",
    header: "الوظيفة",
    accessorFn: ({ clientAssistantRole }) => {
      return clientAssistantRole ?? "لا يوجد";
    },
  },
  {
    accessorKey: "createdBy.name",
    header: "المنشئ",
    accessorFn: ({ createdBy }) => {
      return createdBy?.name ?? "لا يوجد";
    },
  },
  {
    header: "المتاجر",
    cell: ({ row }) => {
      const { role, id, managedStores } = row.original;

      if (role === "CLIENT_ASSISTANT") {
        const stringifiedManagedStores = managedStores.map((store) =>
          store.id.toString()
        );
        return (
          <AssignClientAssistantToStores
            id={id}
            managedStores={stringifiedManagedStores}
          />
        );
      }
      return "--";
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original;
      const [deleteOpened, { open: openDelete, close: closeDelete }] =
        useDisclosure(false);
      const [isMenuOpen, setMenuOpen] = useState(false);
      return (
        <Menu
          zIndex={150}
          opened={isMenuOpen}
          onChange={() => {
            if (deleteOpened) return;
            setMenuOpen(!isMenuOpen);
          }}>
          <Menu.Target>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </Menu.Target>
          <Menu.Dropdown className="space-y-2">
            <Link
              className={buttonVariants({
                variant: "ghost",
                className: "w-full",
              })}
              to={`/employees/${id}/show`}>
              عرض
            </Link>
            <Link
              className={buttonVariants({
                variant: "ghost",
                className: "w-full",
              })}
              to={`/employees/${id}/edit`}>
              تعديل
            </Link>
            <DeleteEmployee
              opened={deleteOpened}
              close={closeDelete}
              open={openDelete}
              id={id}
              closeMenu={() => setMenuOpen(false)}
            />
          </Menu.Dropdown>
        </Menu>
      );
    },
  },
];
