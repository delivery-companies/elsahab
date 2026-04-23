/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-nested-ternary */
import { useEditOrder } from "@/hooks/useEditOrder";
import type { Order } from "@/services/getOrders";
import {
  ActionIcon,
  Button,
  NumberInput,
  Popover,
  TextInput,
} from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { useState } from "react";

interface EditableTableCellProps<T> {
  id: string;
  value: T;
  type: keyof Order;
  typeOfValue: "number" | "string";
  renderCell?: React.ReactNode;
  recipientPhones?: string[];
}

export const EditableTableCell = <T extends string | string>({
  value,
  id,
  type,
  typeOfValue,
  renderCell,
  recipientPhones,
}: EditableTableCellProps<T>) => {
  const [opened, setOpened] = useState(false);
  const [requiredChangeValue, setRequiredChangeValue] = useState(value);

  const { mutate: editOrder, isLoading } = useEditOrder();

  const handleEditOrder = () => {
    const slicedPhones = recipientPhones?.slice(1);
    const newPhones =
      type === "recipientPhones" && requiredChangeValue
        ? [requiredChangeValue, ...slicedPhones!]
        : slicedPhones;

    editOrder(
      {
        id,
        data: {
          [type]:
            type === "recipientPhones"
              ? newPhones
              : typeOfValue === "number"
              ? Number(requiredChangeValue) || 0
              : requiredChangeValue + "" || "",
        },
      },
      {
        onSuccess: () => {
          setOpened(false);
        },
      }
    );
  };

  return (
    <Popover
      key={opened ? "opened" : "closed"}
      trapFocus
      position="bottom"
      withArrow
      shadow="md"
      opened={opened}
      onChange={setOpened}
      onClose={() => setRequiredChangeValue(value)}>
      <Popover.Target>
        <Button
          variant="transparent"
          color="indigo"
          onClick={() => setOpened((o) => !o)}
          classNames={{ label: "underline" }}
          size="compact-sm">
          {renderCell || value}
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <div className="flex gap-2 items-center">
          {type === "recipientPhones" ? (
            <TextInput
              value={requiredChangeValue || ""}
              onChange={(event) =>
                setRequiredChangeValue(event.target.value as T)
              }
              size="xs"
              maxLength={type === "recipientPhones" ? 11 : undefined}
            />
          ) : typeOfValue === "string" ? (
            <TextInput
              value={requiredChangeValue}
              onChange={(event) =>
                setRequiredChangeValue(event.target.value as T)
              }
              rightSection={<></>}
              size="xs"
            />
          ) : (
            <NumberInput
              value={requiredChangeValue}
              onChange={(value) => setRequiredChangeValue(value as T)}
              thousandSeparator={type === "totalCost" && ","}
              rightSection={<></>}
              allowNegative={false}
            />
          )}
          <ActionIcon
            disabled={isLoading}
            onClick={handleEditOrder}
            color="teal">
            <IconCheck />
          </ActionIcon>
        </div>
      </Popover.Dropdown>
    </Popover>
  );
};
