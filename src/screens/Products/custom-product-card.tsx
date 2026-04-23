import type { APIError } from "@/models";
import { deleteProductService } from "@/services/deleteProduct";
import type { Product } from "@/services/getProducts";
import { ActionIcon, Button, Card, Group, Image, Menu, Text, rem } from "@mantine/core";
import { IconDots, IconEdit, IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface CustomTenantCardProps extends Product {}

export const CustomProductCard = ({ image, price, title, id, category, stock }: CustomTenantCardProps) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const handleNavigate = () => {
        navigate(`/home/${id}/show`);
    };
    const { mutate: deleteProduct } = useMutation({
        mutationFn: (id: number) => deleteProductService({ id }),
        onSuccess: () => {
            toast.success("تم مسح المنتج بنجاح");
            queryClient.invalidateQueries({
                queryKey: ["products"]
            });
        },
        onError: (error: AxiosError<APIError>) => {
            toast.error(error.response?.data.message || "حدث خطأ ما");
        }
    });

    const handleDelete = () => {
        deleteProduct(id);
    };

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section>
                <Image
                    src={image}
                    className="aspect-square"
                    fit="cover"
                    fallbackSrc="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
                    alt={title}
                />
            </Card.Section>

            <Group justify="space-between" mt="md" mb="xs">
                <Text fw={500}>{title || "لا يوجد"}</Text>

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
                                navigate(`/home/${id}/edit`);
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
                السعر: {price}
            </Text>
            <Text my={2} size="sm" c="dimmed">
                المتوفر: {stock}
            </Text>
            <Text size="sm" c="dimmed">
                الصنف: {category.title}
            </Text>

            <Button variant="outline" onClick={handleNavigate} fullWidth mt="md" radius="md">
                عرض التفاصيل
            </Button>
        </Card>
    );
};
