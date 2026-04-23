import { buttonVariants } from "@/components/ui/button";
import type { APIError } from "@/models";
import { deleteBannerService } from "@/services/deleteBanner";
import type { Banner } from "@/services/getBannersService";
import { Button, Card, Group, Image, Text, rem } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { format, parseISO } from "date-fns";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { EditBannerModal } from "./EditBannerModal";

interface CustomTenantCardProps extends Banner {}

export const CustomBannerCard = ({ image, title, id, content, createdAt, url }: CustomTenantCardProps) => {
    const queryClient = useQueryClient();
    const { mutate: deleteProduct, isLoading } = useMutation({
        mutationFn: (id: number) => deleteBannerService({ id }),
        onSuccess: () => {
            toast.success("تم مسح البانر بنجاح");
            queryClient.invalidateQueries({
                queryKey: ["banners"]
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
                    fit="contain"
                    fallbackSrc="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
                    alt={title}
                />
            </Card.Section>

            <Group mt="xs" mb="xs">
                <div>
                    <Text size="xl" fw={500}>
                        {title || "بدون عنوان"}
                    </Text>
                </div>

                <Text size="sm" c="dimmed" lineClamp={2}>
                    {content}
                </Text>
                <Text size="sm" c="dimmed" fw={400}>
                    تاريخ الانشاء: {format(parseISO(createdAt), "yyyy-MM-dd HH:mm")}
                </Text>
                <Text size="xs" c="dimmed">
                    <Link
                        target="blank"
                        className={buttonVariants({
                            variant: "ghost",
                            size: "xs",
                            className: "text-xs text-left"
                        })}
                        to={url}
                    >
                        {url}
                    </Link>
                </Text>
            </Group>
            <Group mt="md" grow>
                <Button
                    fullWidth
                    onClick={handleDelete}
                    leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
                    radius="md"
                    disabled={isLoading}
                    loading={isLoading}
                >
                    مسح
                </Button>
                <EditBannerModal image={image} title={title} id={id} content={content} url={url} />
            </Group>
        </Card>
    );
};
