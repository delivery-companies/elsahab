import { buttonVariants } from "@/components/ui/button";
import type { UsersLoginHistory } from "@/services/getUsersLoginHistory";
import { ActionIcon, HoverCard, rem, Text } from "@mantine/core";
import { IconMap2 } from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import Arabic from "date-fns/locale/ar-EG";
import { Link } from "react-router-dom";

export const columns: ColumnDef<UsersLoginHistory>[] = [
    {
        accessorKey: "id",
        header: "#"
    },
    {
        accessorKey: "user.name",
        header: "الاسم",
        cell: ({ row }) => {
            const { user } = row.original;
            const path = user.role === "CLIENT" ? "/clients" : "/employees";
            return (
                <Link
                    className={buttonVariants({
                        variant: "link",
                        className: "text-primary-foreground underline"
                    })}
                    to={`${path}/${user.id}/show`}
                >
                    {user.name}
                </Link>
            );
        }
    },
    {
        accessorKey: "user.username",
        header: "رقم الهاتف"
    },
    {
        accessorKey: "ip",
        header: "الايبي"
    },
    {
        accessorKey: "device",
        header: "الجهاز"
    },
    {
        accessorKey: "platform",
        header: "النظام"
    },
    {
        accessorKey: "browser",
        header: "المتصفح"
    },
    {
        accessorKey: "location",
        header: "الموقع",
        cell: ({ row }) => {
            const { location } = row.original; // 31.0371,31.3844
            const handleClick = () => {
                // window.location.href = `https://www.google.com/maps/search/?api=1&query=${location}`;
                // OPEN IN NEW TAB
                window.open(`https://www.google.com/maps/search/?api=1&query=${location}`, "_blank");
            };
            if (!location) return "";
            return (
                <HoverCard width={rem(120)} shadow="md">
                    <HoverCard.Target>
                        <ActionIcon variant="filled" onClick={handleClick}>
                            <IconMap2 />
                        </ActionIcon>
                    </HoverCard.Target>
                    <HoverCard.Dropdown>
                        <Text size="sm">فتح العنوان في خرائط جوجل</Text>
                    </HoverCard.Dropdown>
                </HoverCard>
            );
        }
    },
    {
        accessorKey: "createdAt",
        header: "التاريخ",
        accessorFn: ({ createdAt }) => {
            const stringToDate = parseISO(createdAt);
            const formattedDate = format(stringToDate, "dd/MM/yyyy HH:mm a", {
                locale: Arabic
            });
            return formattedDate;
        }
    }
];
