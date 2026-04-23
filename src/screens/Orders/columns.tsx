import { EditableTableCell } from "@/components/EditableTableCell";
import { OrdersBadge } from "@/components/OrdersBadge";
import { Button, buttonVariants } from "@/components/ui/button";
import { hideChildrenBasedOnRole } from "@/hooks/useAuthorized";
import { useOrderReceipt } from "@/hooks/useOrderReceipt";
import { useReportsPDF } from "@/hooks/useReportsPDF";
// import { deliveryTypesArabicNames } from "@/lib/deliveryTypesArabicNames";
import { governorateArabicNames } from "@/lib/governorateArabicNames ";
import type { Order } from "@/services/getOrders";
import { useOrdersStore } from "@/store/ordersStore";
import {
  ActionIcon,
  Badge,
  Checkbox,
  HoverCard,
  Menu,
  Text,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconFileTypePdf } from "@tabler/icons-react";
/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/rules-of-hooks */
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { ChangeOrderStatus } from "./components/ChangeOrderStatus";
import { DeleteOrder } from "./components/DeleteOrder";
import { OrderTimelineModal } from "./components/OrderTimelineModal";
import { OrdersFullDetails } from "./components/OrdersFullDetails";
import { CreateTicket } from "./components/Createticket";
import { useAuth } from "@/store/authStore";

export const columns: ColumnDef<Order>[] = [
  {
    id: "index",
    header: "#",
    cell: ({ row }) => <span>{row.index + 1}</span>,
  },
  {
    id: "select",
    header: ({ table }) => {
      const { deleteAllOrders, setAllOrders, isOrderExist } = useOrdersStore();

      return (
        <Checkbox
          checked={
            table.getRowModel().rows.length > 0 &&
            table
              .getRowModel()
              .rows.every((row) => isOrderExist(row.original.id.toString()))
          }
          onChange={(event) => {
            const allTableRowsIds = table.getRowModel().rows.map((row) => ({
              id: row.original.id.toString(),
              name: row.original.recipientName,
            }));

            const isAllSelected = event.currentTarget.checked;

            if (isAllSelected) {
              setAllOrders(allTableRowsIds);
              table.toggleAllPageRowsSelected(true);
            } else {
              table.toggleAllPageRowsSelected(false);
              deleteAllOrders();
            }
          }}
        />
      );
    },
    cell: ({ row }) => {
      const { addOrder, deleteOrder, isOrderExist } = useOrdersStore();
      return (
        <div className="flex items-center gap-4">
          <Checkbox
            checked={isOrderExist(row.original.id.toString())}
            onChange={(value) => {
              const isChecked = value.currentTarget.checked;
              const { id, recipientName } = row.original;
              if (isChecked) {
                addOrder({ id: id.toString(), name: recipientName });
                row.toggleSelected(true);
              } else {
                row.toggleSelected(false);
                deleteOrder(id.toString());
              }
            }}
          />
          <OrdersFullDetails order={row.original} />
        </div>
      );
    },
  },
  {
    accessorKey: "id",
    header: "رقم الطلبيه",
    cell: ({ row }) => (
      <Text
        style={{
          width: "90px",
          overflow: "visible",
          maxWidth: "unset",
          whiteSpace: "wrap",
          fontSize: "14px",
        }}>
        {row.original.id}
      </Text>
    ),
  },
  {
    accessorKey: "receiptNumber",
    header: "رقم الوصل ",
    cell: ({ row }) => {
      const { role } = useAuth();

      if (role === "CLIENT" || role === "CLIENT_ASSISTANT") {
        return row.original.receiptNumber;
      }
      return (
        <EditableTableCell
          typeOfValue="string"
          id={row.original.id}
          type="receiptNumber"
          value={row.original.receiptNumber}
        />
      );
    },
  },
  {
    accessorKey: "client.name",
    header: "العميل",
    cell: ({ row }) => {
      const { client, store } = row.original;
      return (
        <Text
          truncate
          maw={rem(100)}
          size="sm"
          style={{
            width: "150px",
            overflow: "visible",
            maxWidth: "unset",
            whiteSpace: "wrap",
            fontSize: "12px",
            fontWeight: "bold",
          }}>
          {client.name + " | " + store.name}
        </Text>
      );
    },
  },
  {
    accessorKey: "client.company",
    header: "شركه العميل",
    cell: ({ row }) => {
      const { client } = row.original;
      return (
        <Text
          truncate
          maw={rem(100)}
          size="sm"
          style={{
            width: "150px",
            overflow: "visible",
            maxWidth: "unset",
            whiteSpace: "wrap",
            fontSize: "12px",
            fontWeight: "bold",
          }}>
          {client.company + " | " + client.branch}
        </Text>
      );
    },
  },
  {
    accessorKey: "recipientPhone",
    header: "رقم الهاتف",
    cell: ({ row }) => {
      const { recipientPhones } = row.original;
      return (
        <EditableTableCell
          id={row.original.id}
          type="recipientPhones"
          value={row.original.recipientPhones[0]}
          typeOfValue="string"
          recipientPhones={recipientPhones}
          renderCell={
            recipientPhones.length > 0 ? (
              recipientPhones.length === 1 ? (
                <Text size="sm">{recipientPhones[0]}</Text>
              ) : (
                <div className="flex items-center gap-2">
                  <Text size="sm">{recipientPhones[0]}</Text>
                  <Badge color="blue" variant="light">
                    +{recipientPhones.length - 1}
                  </Badge>
                </div>
              )
            ) : (
              <Text size="sm">لا يوجد</Text>
            )
          }
        />
      );
    },
  },
  {
    header: "العنوان",
    cell: ({ row }) => {
      const { recipientAddress, governorate, location } = row.original;
      return (
        <Text
          truncate
          maw={rem(100)}
          size="sm"
          style={{
            width: "150px",
            overflow: "visible",
            maxWidth: "unset",
            whiteSpace: "wrap",
          }}>
          {governorateArabicNames[governorate]}{" "}
          {location?.name && `- ${location?.name}`}{" "}
          {recipientAddress && `- ${recipientAddress}`}
        </Text>
      );
    },
  },
  {
    accessorKey: "totalCost",
    header: "المبلغ",
    cell: ({ row }) => {
      const { role } = useAuth();
      const formattedNumber = row.original.totalCost
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      if (role === "CLIENT" || role === "CLIENT_ASSISTANT") {
        return formattedNumber;
      }
      return (
        <EditableTableCell
          id={row.original.id}
          type="totalCost"
          value={formattedNumber}
          typeOfValue="number"
        />
      );
    },
  },
  {
    accessorKey: "paidAmount",
    header: "المبلغ المدفوع",
    cell: ({ row }) => {
      const { role } = useAuth();

      const formattedNumber = row.original.paidAmount
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      if (role === "CLIENT" || role === "CLIENT_ASSISTANT") {
        return formattedNumber;
      }
      return (
        <EditableTableCell
          id={row.original.id}
          type="paidAmount"
          value={formattedNumber}
          typeOfValue="number"
        />
      );
    },
  },
  {
    accessorKey: "deliveryCost",
    header: "تكلفة التوصيل",
  },
  {
    accessorKey: "status",
    header: "الحالة",
    cell: ({ row }) => {
      const { status, secondaryStatus, repository } = row.original;
      return (
        <OrdersBadge
          status={status}
          secondaryStatus={secondaryStatus}
          repositoryname={repository?.name}
        />
      );
    },
  },
  {
    accessorKey: "clientReport",
    header: "كشف عميل",
    cell: ({ row }) => {
      const { clientReport } = row.original;
      const { mutateAsync: getReportPDF } = useReportsPDF("كشف عميل");

      const handleDownload = (id: number) => {
        if (!clientReport) return;
        toast.promise(getReportPDF(id), {
          loading: "جاري تحميل الكشف...",
          success: "تم تحميل الكشف بنجاح",
          error: (error) => error.message || "حدث خطأ ما",
        });
      };
      if (clientReport?.length === 0) {
        return "لا يوجد";
      }

      return (
        <div style={{ display: "flex", gap: "5px" }}>
          {clientReport?.map((r) => {
            if (r.deleted) {
              return (
                <Text
                  style={{
                    fontSize: "12px",
                    color: r.secondaryType === "DELIVERED" ? "green" : "red",
                  }}>
                  تم الحذف
                </Text>
              );
            }
            return (
              <div>
                <HoverCard width={rem(120)} shadow="md">
                  <HoverCard.Target>
                    <ActionIcon
                      variant="filled"
                      onClick={() => {
                        console.log(r);

                        if (r.url) {
                          window.open(r.url, "_blank");
                          return;
                        }
                        handleDownload(r.id);
                      }}>
                      <IconFileTypePdf />
                    </ActionIcon>
                  </HoverCard.Target>
                  <HoverCard.Dropdown>
                    <Text size="sm">تحميل الكشف</Text>
                  </HoverCard.Dropdown>
                </HoverCard>
                <Text
                  style={{
                    fontSize: "12px",
                    color: r.secondaryType === "DELIVERED" ? "green" : "red",
                  }}>
                  {r.secondaryType === "DELIVERED" ? "واصل" : "راجع"}
                </Text>
              </div>
            );
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "branchReport",
    header: "كشف فرع",
    cell: ({ row }) => {
      const { branchReport } = row.original;
      const { mutateAsync: getReportPDF } = useReportsPDF("كشف فرع");

      const handleDownload = (id: number) => {
        if (!branchReport) return;
        toast.promise(getReportPDF(id), {
          loading: "جاري تحميل الكشف...",
          success: "تم تحميل الكشف بنجاح",
          error: (error) => error.message || "حدث خطأ ما",
        });
      };
      if (branchReport?.length === 0) {
        return "لا يوجد";
      }
      return (
        <div style={{ display: "flex", gap: "5px" }}>
          {branchReport?.map((r) => {
            if (r.deleted) {
              return (
                <Text
                  style={{
                    fontSize: "12px",
                    color: r.type === "forwarded" ? "green" : "red",
                  }}>
                  تم الحذف
                </Text>
              );
            }
            return (
              <div>
                <HoverCard width={rem(120)} shadow="md">
                  <HoverCard.Target>
                    <ActionIcon
                      variant="filled"
                      onClick={() => {
                        if (r.url) {
                          window.open(r.url, "_blank");
                          return;
                        }
                        handleDownload(r.id);
                      }}>
                      <IconFileTypePdf />
                    </ActionIcon>
                  </HoverCard.Target>
                  <HoverCard.Dropdown>
                    <Text size="sm">تحميل الكشف</Text>
                  </HoverCard.Dropdown>
                </HoverCard>
                <Text
                  style={{
                    fontSize: "12px",
                    color: r.type === "forwarded" ? "green" : "red",
                  }}>
                  {r.type === "forwarded" ? "وارد" : "صادر"}
                </Text>
              </div>
            );
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "deliveryAgentReport",
    header: "كشف مندوب",
    cell: ({ row }) => {
      const { deliveryAgentReport } = row.original;
      const { mutateAsync: getReportPDF } = useReportsPDF("كشف مندوب");

      // const handleDownload = () => {
      //   if (!deliveryAgentReport) return;
      //   toast.promise(getReportPDF(deliveryAgentReport.id), {
      //     loading: "جاري تحميل الكشف...",
      //     success: "تم تحميل الكشف بنجاح",
      //     error: (error) => error.message || "حدث خطأ ما",
      //   });
      // };

      const handleClick = () => {
        // ✅ Already generated → open in new tab
        if (deliveryAgentReport.url) {
          window.open(deliveryAgentReport.url, "_blank");
          return;
        }

        if (!deliveryAgentReport) return;
        toast.promise(getReportPDF(deliveryAgentReport.id), {
          loading: "جاري تحميل الكشف...",
          success: "تم تحميل الكشف بنجاح",
          error: (error) => error.message || "حدث خطأ ما",
        });
      };

      if (!deliveryAgentReport) return "لا يوجد";

      return deliveryAgentReport.deleted ? (
        <Text size="sm">تم حذف الكشف</Text>
      ) : (
        <HoverCard width={rem(120)} shadow="md">
          <HoverCard.Target>
            <ActionIcon variant="filled" onClick={handleClick}>
              <IconFileTypePdf />
            </ActionIcon>
          </HoverCard.Target>
          <HoverCard.Dropdown>
            <Text size="sm">تحميل الكشف</Text>
          </HoverCard.Dropdown>
        </HoverCard>
      );
    },
  },
  {
    accessorKey: "repositoryReport",
    header: "كشف مخزن",
    cell: ({ row }) => {
      const { repositoryReport } = row.original;
      const { mutateAsync: getReportPDF } = useReportsPDF("كشف مخزن");

      const handleDownload = (id: number) => {
        if (!repositoryReport) return;
        toast.promise(getReportPDF(id), {
          loading: "جاري تحميل الكشف...",
          success: "تم تحميل الكشف بنجاح",
          error: (error) => error.message || "حدث خطأ ما",
        });
      };
      if (repositoryReport?.length === 0) {
        return "لا يوجد";
      }
      return (
        <div style={{ display: "flex", gap: "5px" }}>
          {repositoryReport?.map((r) => {
            if (r.deleted) {
              return (
                <Text
                  style={{
                    fontSize: "12px",
                    color: r.secondaryType === "DELIVERED" ? "green" : "red",
                  }}>
                  تم الحذف
                </Text>
              );
            }
            return (
              <div>
                <HoverCard width={rem(120)} shadow="md">
                  <HoverCard.Target>
                    <ActionIcon
                      variant="filled"
                      onClick={() => {
                        handleDownload(r.id);
                      }}>
                      <IconFileTypePdf />
                    </ActionIcon>
                  </HoverCard.Target>
                  <HoverCard.Dropdown>
                    <Text size="sm">تحميل الكشف</Text>
                  </HoverCard.Dropdown>
                </HoverCard>
                <Text
                  style={{
                    fontSize: "12px",
                    color: r.secondaryType === "DELIVERED" ? "green" : "red",
                  }}>
                  {r.secondaryType === "DELIVERED" ? "واصل" : "راجع"}
                </Text>
              </div>
            );
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "governorateReport",
    header: "كشف محافظة",
    cell: ({ row }) => {
      const { governorateReport } = row.original;
      const { mutateAsync: getReportPDF } = useReportsPDF("كشف محافظة");

      const handleDownload = () => {
        if (!governorateReport) return;
        toast.promise(getReportPDF(governorateReport.id), {
          loading: "جاري تحميل الكشف...",
          success: "تم تحميل الكشف بنجاح",
          error: (error) => error.message || "حدث خطأ ما",
        });
      };

      if (!governorateReport) return "لا يوجد";
      return governorateReport.deleted ? (
        <Text size="sm">تم حذف الكشف</Text>
      ) : (
        <HoverCard width={rem(120)} shadow="md">
          <HoverCard.Target>
            <ActionIcon variant="filled" onClick={handleDownload}>
              <IconFileTypePdf />
            </ActionIcon>
          </HoverCard.Target>
          <HoverCard.Dropdown>
            <Text size="sm">تحميل الكشف</Text>
          </HoverCard.Dropdown>
        </HoverCard>
      );
    },
  },
  {
    accessorKey: "companyReport",
    header: "كشف شركة",
    cell: ({ row }) => {
      const { companyReport } = row.original;
      const { mutateAsync: getReportPDF } = useReportsPDF("كشف شركة");

      const handleDownload = (id: number) => {
        if (!companyReport) return;
        toast.promise(getReportPDF(id), {
          loading: "جاري تحميل الكشف...",
          success: "تم تحميل الكشف بنجاح",
          error: (error) => error.message || "حدث خطأ ما",
        });
      };
      if (companyReport?.length === 0) {
        return "لا يوجد";
      }
      return (
        <div style={{ display: "flex", gap: "5px" }}>
          {companyReport?.map((r) => {
            if (r.deleted) {
              return (
                <Text
                  style={{
                    fontSize: "12px",
                    color: r.secondaryType === "DELIVERED" ? "green" : "red",
                  }}>
                  تم الحذف
                </Text>
              );
            }
            return (
              <div>
                <HoverCard width={rem(120)} shadow="md">
                  <HoverCard.Target>
                    <ActionIcon
                      variant="filled"
                      onClick={() => {
                        handleDownload(r.id);
                      }}>
                      <IconFileTypePdf />
                    </ActionIcon>
                  </HoverCard.Target>
                  <HoverCard.Dropdown>
                    <Text size="sm">تحميل الكشف</Text>
                  </HoverCard.Dropdown>
                </HoverCard>
                <Text
                  style={{
                    fontSize: "12px",
                    color: r.secondaryType === "DELIVERED" ? "green" : "red",
                  }}>
                  {r.secondaryType === "DELIVERED" ? "واصل" : "راجع"}
                </Text>
              </div>
            );
          })}
        </div>
      );
    },
  },

  {
    id: "receipt",
    header: "الفاتوره",
    cell: ({ row }) => {
      const { id, recipientName } = row.original;
      const { mutateAsync: getReceipt } = useOrderReceipt(recipientName);

      const handleDownload = () => {
        toast.promise(getReceipt([id]), {
          loading: "جاري تحميل الفاتورة...",
          success: "تم تحميل الفاتورة بنجاح",
          error: (error) => {
            return error.message || "حدث خطأ ما";
          },
        });
      };
      return (
        <div className="flex justify-center mt-2">
          <HoverCard width={rem(120)} shadow="md">
            <HoverCard.Target>
              <ActionIcon variant="filled" onClick={handleDownload}>
                <IconFileTypePdf />
              </ActionIcon>
            </HoverCard.Target>
          </HoverCard>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id, status } = row.original;

      const [timelineOpened, { open: openTimeline, close: closeTimeline }] =
        useDisclosure(false);
      const [deleteOpened, { open: openDelete, close: closeDelete }] =
        useDisclosure(false);
      const [ticketOpened, { open: openTicket, close: closeTicket }] =
        useDisclosure(false);
      const [
        changeStatusOpened,
        { open: openChangeStatus, close: closeChangeStatus },
      ] = useDisclosure(false);

      const [isMenuOpen, setMenuOpen] = useState(false);

      return (
        <Menu
          zIndex={150}
          opened={isMenuOpen}
          onChange={() => {
            if (
              timelineOpened ||
              deleteOpened ||
              changeStatusOpened ||
              ticketOpened
            )
              return;
            setMenuOpen(!isMenuOpen);
          }}>
          <Menu.Target>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Link
              className={buttonVariants({
                variant: "ghost",
                className: "w-full",
              })}
              to={`/orders/${id}/show`}>
              عرض
            </Link>
            {hideChildrenBasedOnRole(
              ["CLIENT"],
              <>
                <Link
                  className={buttonVariants({
                    variant: "ghost",
                    className: "w-full",
                  })}
                  to={`/orders/${id}/edit`}>
                  تعديل
                </Link>
                <DeleteOrder
                  closeMenu={() => setMenuOpen(false)}
                  id={id}
                  opened={deleteOpened}
                  close={closeDelete}
                  open={openDelete}
                />
                <ChangeOrderStatus
                  closeMenu={() => setMenuOpen(false)}
                  id={id}
                  opened={changeStatusOpened}
                  close={closeChangeStatus}
                  open={openChangeStatus}
                  status={status}
                />
              </>
            )}
            <CreateTicket
              closeMenu={() => setMenuOpen(false)}
              id={id}
              opened={ticketOpened}
              close={closeTicket}
              open={openTicket}
            />
            <OrderTimelineModal
              closeMenu={() => setMenuOpen(false)}
              opened={timelineOpened}
              close={closeTimeline}
              open={openTimeline}
              id={id}
            />
          </Menu.Dropdown>
        </Menu>
      );
    },
  },
];
