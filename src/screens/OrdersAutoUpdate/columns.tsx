import { useEditAutomaticUpdateTimer } from "@/hooks/useEditAutomaticUpdateTimer";
/* eslint-disable react-hooks/rules-of-hooks */
import { orderStatusArabicNames } from "@/lib/orderStatusArabicNames";
import type { APIError } from "@/models";
import { deleteAutomaticUpdateDateService } from "@/services/deleteAutomaticUpdateDate";
import {
  type AutomaticUpdate,
  returnConditionArabicNames,
} from "@/services/getAutomaticUpdates";
import { ActionIcon, Button, Switch, rem } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { EditAutomaticUpdateTimer } from "./components/EditAutomaticUpdateTimer";

export const columns: ColumnDef<AutomaticUpdate>[] = [
  {
    id: "#",
    accessorKey: "id",
    header: "#",
  },
  {
    accessorKey: "orderStatus",
    header: "الاسم",
    cell: ({ row }) => {
      return (
        <div>
          {orderStatusArabicNames[row.original.orderStatus]}
          {row.original.notes ? " - " + row.original.notes : ""}
        </div>
      );
    },
  },
  {
    accessorKey: "returnCondition",
    header: "شرط الراجع",
    cell: ({ row }) => {
      return (
        <div>{returnConditionArabicNames[row.original.returnCondition]}</div>
      );
    },
  },

  {
    accessorKey: "updateAt",
    header: "يوميا علي الساعة",
  },
  {
    accessorKey: "checkAfter",
    header: "القيمة (بالساعة)",
  },
  {
    accessorKey: "enabled",
    header: "مفعل",
    cell: ({ row }) => {
      const { mutate: editDate, isLoading } = useEditAutomaticUpdateTimer();

      return (
        <Switch
          checked={row.original.enabled}
          disabled={isLoading}
          onChange={(event) => {
            editDate({
              id: row.original.id,
              data: { enabled: event.currentTarget.checked },
            });
          }}
        />
      );
    },
  },
  {
    header: "السجل",
    cell: ({ row }) => {
      const navigate = useNavigate();

      const handleNavigate = () => {
        navigate("/orders", {
          state: {
            automatic_update_id: row.original.id,
          },
        });
      };
      return (
        <Button onClick={handleNavigate} variant="subtle" size="xs">
          عرض السجل
        </Button>
      );
    },
  },
  {
    id: "action",
    header: "الحذف",
    cell: ({ row }) => {
      const queryClient = useQueryClient();
      const { mutate: deleteDate } = useMutation({
        mutationFn: (id: number) => {
          return deleteAutomaticUpdateDateService({ id });
        },
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["automaticUpdates"],
          });
          toast.success("تم حذف الموعد بنجاح");
        },
        onError: (error: AxiosError<APIError>) => {
          toast.error(error.response?.data.message || "حدث خطأ ما");
        },
      });

      const handleDelete = () => {
        deleteDate(row.original.id);
      };

      return (
        <div className="flex items-center gap-2">
          <EditAutomaticUpdateTimer {...row.original} />
          <ActionIcon onClick={handleDelete} variant="filled">
            <IconTrash
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
          </ActionIcon>
        </div>
      );
    },
  },
];
