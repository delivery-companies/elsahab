import { Button, buttonVariants } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { governorateArabicNames } from "@/lib/governorateArabicNames ";
import type { Location } from "@/services/getLocations";
import { useLocationsStore } from "@/store/locationsStore";
import { Badge, Checkbox, Flex, Text } from "@mantine/core";
/* eslint-disable react-hooks/rules-of-hooks */
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { DeleteLocation } from "./delete-location";

export const columns: ColumnDef<Location>[] = [
    {
        id: "select",
        header: ({ table }) => {
            const { deleteAllLocations, setAllLocations, isLocationExist } = useLocationsStore();

            return (
                <Checkbox
                    checked={
                        table.getRowModel().rows.length > 0 &&
                        table.getRowModel().rows.every((row) => isLocationExist(row.original.id.toString()))
                    }
                    onChange={(event) => {
                        const allTableRowsIds = table.getRowModel().rows.map((row) => ({
                            id: row.original.id.toString(),
                            name: row.original.name
                        }));

                        const isAllSelected = event.currentTarget.checked;

                        if (isAllSelected) {
                            setAllLocations(allTableRowsIds);
                            table.toggleAllPageRowsSelected(true);
                        } else {
                            table.toggleAllPageRowsSelected(false);
                            deleteAllLocations();
                        }
                    }}
                />
            );
        },
        cell: ({ row }) => {
            const { addLocation, deleteLocation, isLocationExist } = useLocationsStore();
            return (
                <Checkbox
                    checked={isLocationExist(row.original.id.toString())}
                    onChange={(value) => {
                        const isChecked = value.currentTarget.checked;
                        const { id, name } = row.original;
                        if (isChecked) {
                            addLocation({ id: id.toString(), name });
                            row.toggleSelected(true);
                        } else {
                            row.toggleSelected(false);
                            deleteLocation(id.toString());
                        }
                    }}
                />
            );
        }
    },
    {
        accessorKey: "id",
        header: "#"
    },
    {
        accessorKey: "name",
        header: "الاسم"
    },
    {
        accessorKey: "branch.name",
        header: "الفرع"
    },
    {
        accessorKey: "governorate",
        header: "المحافظة",
        accessorFn: ({ governorate }) => {
            return governorateArabicNames[governorate] ?? "لا يوجد";
        }
    },
    {
        header: "اسم المندوب",
        cell: ({ row }) => {
            const { deliveryAgents } = row.original;
            // eslint-disable-next-line no-nested-ternary
            return deliveryAgents.length > 1 ? (
                <Flex gap="xs">
                    <Text size="sm">{deliveryAgents[0].name}</Text>
                    <Badge color="blue" variant="light">
                        {deliveryAgents.length - 1}+
                    </Badge>
                </Flex>
            ) : deliveryAgents.length === 1 ? (
                <Text size="sm">{deliveryAgents[0].name}</Text>
            ) : (
                <Text size="sm">لا يوجد</Text>
            );
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const location = row.original;
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
                                className: "w-full"
                            })}
                            to={`/locations/${location.id}/show`}
                        >
                            عرض
                        </Link>
                        <Link
                            className={buttonVariants({
                                variant: "ghost",
                                className: "w-full"
                            })}
                            to={`/locations/${location.id}/edit`}
                        >
                            تعديل
                        </Link>
                        <DeleteLocation id={location.id} />
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }
    }
];
