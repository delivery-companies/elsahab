import { Button, buttonVariants } from "@/components/ui/button";
import { rolesArabicNames } from "@/lib/rolesArabicNames";
/* eslint-disable react-hooks/rules-of-hooks */
import type { Employee } from "@/services/getEmployeesService";
import { Avatar, Menu } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { AssignClientAssistantToStores } from "./AssignClientAssistantToStores";
import { AssignInquiryEmployeeBranches } from "./AssignInquiryEmployeeBranches";
import { AssignInquiryEmployeeCompanies } from "./AssignInquiryEmployeeCompanies";
import { AssignInquiryEmployeeGovernorate } from "./AssignInquiryEmployeeGovernorate";
import { AssignInquiryEmployeeLocations } from "./AssignInquiryEmployeeLocations";
import { AssignInquiryEmployeeStatuses } from "./AssignInquiryEmployeeStatuses";
import { AssignInquiryEmployeeStores } from "./AssignInquiryEmployeeStores";
import { DeleteEmployee } from "./DeleteEmployee";
import { AssignInquiryClients } from "./AssignReceivingAgentToClients";
import { AssignOrderType } from "./EditOrderType";

export const columns: ColumnDef<Employee>[] = [
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
    accessorKey: "username",
    header: "اسم المستخدم",
  },
  {
    accessorKey: "phone",
    header: "رقم الهاتف",
  },
  {
    accessorKey: "role",
    header: "الوظيفة",
    accessorFn: ({ role, emergency, mainEmergency }) => {
      if (emergency) {
        return rolesArabicNames["EMERGENCY_EMPLOYEE"];
      } else if (mainEmergency) {
        return "موظف متابعه رئيسي";
      }
      return rolesArabicNames[role];
    },
  },
  {
    accessorKey: "branch",
    header: "الفرع",
    accessorFn: ({ branch }) => {
      return branch?.name ?? "لا يوجد";
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
      const { role, id, inquiryStores } = row.original;
      if (role === "EMPLOYEE_CLIENT_ASSISTANT") {
        const stringifiedManagedStores = inquiryStores.map((store) =>
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
    accessorKey: "repository",
    header: "المخزن",
    accessorFn: ({ repository }) => {
      return repository?.name ?? "لا يوجد";
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const { id, role, orderType } = row.original;
      const [deleteOpened, { open: openDelete, close: closeDelete }] =
        useDisclosure(false);
      const [
        inquiryBranchesOpened,
        { open: openInquiryBranches, close: closeInquiryBranches },
      ] = useDisclosure(false);
      const [
        inquiryStatusesOpened,
        { open: openInquiryStatuses, close: closeInquiryStatuses },
      ] = useDisclosure(false);
      const [
        inquiryGovernoratesOpened,
        { open: openInquiryGovernorates, close: closeInquiryGovernorates },
      ] = useDisclosure(false);
      const [
        inquiryStoresOpened,
        { open: openInquiryStores, close: closeInquiryStores },
      ] = useDisclosure(false);
      const [
        inquiryCompaniesOpened,
        { open: openInquiryCompanies, close: closeInquiryCompanies },
      ] = useDisclosure(false);
      const [
        inquiryLocationsOpened,
        { open: openInquiryLocations, close: closeInquiryLocations },
      ] = useDisclosure(false);
      const [
        inquiryClientsOpened,
        { open: openInquiryClients, close: closeInquiryClients },
      ] = useDisclosure(false);

      const [
        orderTypeOpened,
        { open: openInquiryOrderType, close: closeInquiryOrderType },
      ] = useDisclosure(false);

      const [isMenuOpen, setMenuOpen] = useState(false);

      const isInquiryRole = role === "INQUIRY_EMPLOYEE";
      const stringifiedManagedBranches = row.original.inquiryBranches.map(
        (branch) => branch.id.toString()
      );

      const stringifiedLocations = row.original.inquiryLocations.map(
        (location) => location.id.toString()
      );
      const stringifiedStores = row.original.inquiryStores.map((store) =>
        store.id.toString()
      );

      const stringifiedCompanies = row.original.inquiryCompanies.map(
        (company) => company.id.toString()
      );

      const stringifiedClients = row.original.inquiryClients.map((client) =>
        client.id.toString()
      );

      return (
        <Menu
          zIndex={150}
          opened={isMenuOpen}
          onChange={() => {
            if (
              deleteOpened ||
              inquiryBranchesOpened ||
              inquiryStatusesOpened ||
              inquiryGovernoratesOpened ||
              inquiryStoresOpened ||
              inquiryCompaniesOpened ||
              inquiryLocationsOpened ||
              orderTypeOpened ||
              inquiryClientsOpened
            )
              return;
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
            {isInquiryRole && (
              <>
                <AssignInquiryEmployeeBranches
                  opened={inquiryBranchesOpened}
                  close={closeInquiryBranches}
                  open={openInquiryBranches}
                  id={id}
                  closeMenu={() => setMenuOpen(false)}
                  managedBranches={stringifiedManagedBranches}
                />
                <AssignOrderType
                  opened={orderTypeOpened}
                  close={closeInquiryOrderType}
                  open={openInquiryOrderType}
                  id={id}
                  closeMenu={() => setMenuOpen(false)}
                  ordertype={orderType}
                />
                <AssignInquiryEmployeeLocations
                  opened={inquiryLocationsOpened}
                  close={closeInquiryLocations}
                  open={openInquiryLocations}
                  id={id}
                  closeMenu={() => setMenuOpen(false)}
                  managedLocations={stringifiedLocations}
                />
                <AssignInquiryEmployeeStores
                  opened={inquiryStoresOpened}
                  close={closeInquiryStores}
                  open={openInquiryStores}
                  id={id}
                  closeMenu={() => setMenuOpen(false)}
                  managedStores={stringifiedStores}
                />
                <AssignInquiryEmployeeCompanies
                  opened={inquiryCompaniesOpened}
                  close={closeInquiryCompanies}
                  open={openInquiryCompanies}
                  id={id}
                  closeMenu={() => setMenuOpen(false)}
                  managedCompanies={stringifiedCompanies}
                />
                <AssignInquiryEmployeeGovernorate
                  opened={inquiryGovernoratesOpened}
                  close={closeInquiryGovernorates}
                  open={openInquiryGovernorates}
                  id={id}
                  closeMenu={() => setMenuOpen(false)}
                  managedGovernorate={row.original.inquiryGovernorates}
                />
                <AssignInquiryEmployeeStatuses
                  opened={inquiryStatusesOpened}
                  close={closeInquiryStatuses}
                  open={openInquiryStatuses}
                  id={id}
                  closeMenu={() => setMenuOpen(false)}
                  managedStatuses={row.original.inquiryStatuses}
                />
              </>
            )}
            {role === "RECEIVING_AGENT" ? (
              <AssignInquiryClients
                opened={inquiryClientsOpened}
                close={closeInquiryClients}
                open={openInquiryClients}
                id={id}
                closeMenu={() => setMenuOpen(false)}
                managedClients={stringifiedClients}
              />
            ) : null}
          </Menu.Dropdown>
        </Menu>
      );
    },
  },
];
