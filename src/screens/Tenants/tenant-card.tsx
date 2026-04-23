import type { APIError } from "@/models";
import { deleteTenantService } from "@/services/deleteTenant";
import type { Tenant } from "@/services/getTenants";
import { ActionIcon, Button, Card, Group, Image, Menu, Text, rem } from "@mantine/core";
import { IconDots, IconEdit, IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface CustomTenantCardProps extends Tenant {}

export const CustomTenantCard = ({
    logo,
    name,
    registrationText,
    website,
    phone,
    id
}: CustomTenantCardProps) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const handleNavigate = () => {
        navigate(`/tenants/${id}/show`);
    };
    const { mutate: deleteTenant } = useMutation({
        mutationFn: (id: number) => deleteTenantService({ id }),
        onSuccess: () => {
            toast.success("تم مسح المستأجر بنجاح");
            queryClient.invalidateQueries({
                queryKey: ["tenants"]
            });
        },
        onError: (error: AxiosError<APIError>) => {
            toast.error(error.response?.data.message || "حدث خطأ ما");
        }
    });

    const handleDelete = () => {
        deleteTenant(id);
    };

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section component="a" href={website}>
                <Image
                    src={logo}
                    fit="fill"
                    className="w-full h-80"
                    fallbackSrc="https://placehold.co/600x400?text=Placeholder"
                    alt={name}
                />
            </Card.Section>

            <Group justify="space-between" mt="md" mb="xs">
                <Text fw={500}>{name}</Text>

                <Menu withinPortal position="bottom-end" shadow="sm">
                    <Menu.Target>
                        <ActionIcon variant="subtle" color="gray">
                            <IconDots style={{ width: rem(16), height: rem(16) }} />
                        </ActionIcon>
                    </Menu.Target>

                    <Menu.Dropdown>
                        <Menu.Item
                            leftSection={<IconEdit style={{ width: rem(14), height: rem(14) }} />}
                            onClick={() => {
                                navigate(`/tenants/${id}/edit`);
                            }}
                        >
                            تعديل
                        </Menu.Item>
                        <Menu.Item
                            leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
                            color="red"
                            onClick={handleDelete}
                        >
                            مسح
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Group>

            <Text size="sm" c="dimmed">
                {phone}
            </Text>
            <Text size="sm" c="dimmed" my={10} truncate="end">
                {registrationText}
            </Text>

            <Button variant="outline" onClick={handleNavigate} fullWidth mt="md" radius="md">
                عرض التفاصيل
            </Button>
        </Card>
    );
};
