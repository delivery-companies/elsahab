/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-nested-ternary */
import { useEditDepartment } from "@/hooks/useDepartments";
import { Department } from "@/services/departments";
import { ActionIcon, Button, Popover, TextInput } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { useState } from "react";

interface EditableTableCellProps<T> {
    id: number;
    value: T;
    type: keyof Department;
    typeOfValue: "number" | "string";
    renderCell?: React.ReactNode;
    recipientPhones?: string[];
}

export const EditableTableCell = <T extends string | string>({
    value,
    id,
    renderCell,
}: EditableTableCellProps<T>) => {
    const [opened, setOpened] = useState(false);
    const [requiredChangeValue, setRequiredChangeValue] = useState(value);

    const { mutate: editDepartment, isLoading } = useEditDepartment();

    const handleEditOrder = () => {
        editDepartment({id:+id,name:requiredChangeValue});
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
            onClose={() => setRequiredChangeValue(value)}
        >
            <Popover.Target>
                <Button
                    variant="transparent"
                    color="indigo"
                    onClick={() => setOpened((o) => !o)}
                    classNames={{ label: "underline" }}
                    size="compact-sm"
                >
                    {renderCell || value}
                </Button>
            </Popover.Target>
            <Popover.Dropdown>
                <div className="flex gap-2 items-center">
                    <TextInput
                        value={requiredChangeValue || ""}
                        onChange={(event) => setRequiredChangeValue(event.target.value as T)}
                        size="xs"
                    />
                    <ActionIcon disabled={isLoading} onClick={handleEditOrder} color="teal">
                        <IconCheck />
                    </ActionIcon>
                </div>
            </Popover.Dropdown>
        </Popover>
    );
};
