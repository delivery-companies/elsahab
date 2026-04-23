import { useNotifications } from "@/hooks/useNotifications";
import { cn } from "@/lib/utils";
import type { APIError } from "@/models";
import { markAllNotificationsAsReadService } from "@/services/markAllNotificationsAsRead";
import { markNotificationAsSeenService } from "@/services/markNotificationAsSeen";
import { Button, Loader, Menu, ScrollArea, Text, rem } from "@mantine/core";
import { useIntersection } from "@mantine/hooks";
import { IconBell } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { format, parseISO } from "date-fns";
import Arabic from "date-fns/locale/ar-EG";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

export const NotificationsList = () => {
    const queryClient = useQueryClient();
    const { data: notifications, fetchNextPage, isFetchingNextPage } = useNotifications();
    const flattenNotifications = notifications?.pages?.flatMap((item) => item.data);
    const isUnseen = flattenNotifications?.some((item) => !item.seen);

    const { mutate: markMessageAsRead } = useMutation({
        mutationFn: (id: number) => markNotificationAsSeenService({ id }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["notifications"]
            });
        },
        onError: (error: AxiosError<APIError>) => {
            toast.error(error.response?.data.message || "حدث خطأ ما");
        }
    });

    const { mutate: markAllNotificationsAsRead } = useMutation({
        mutationFn: () => markAllNotificationsAsReadService(),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["notifications"]
            });
        },
        onError: (error: AxiosError<APIError>) => {
            toast.error(error.response?.data.message || "حدث خطأ ما");
        }
    });

    const thirdLastNotificationRef = useRef<HTMLDivElement>(null);
    const { entry, ref } = useIntersection({
        root: thirdLastNotificationRef.current,
        threshold: 1
    });

    useEffect(() => {
        if (entry?.isIntersecting) {
            fetchNextPage();
        }
    }, [entry, fetchNextPage]);

    const handleMarkAsRead = (id: number, isSeen: boolean) => {
        if (isSeen) return;
        markMessageAsRead(id);
    };

    return (
        <Menu position="bottom-end" shadow="md" width={rem(338)}>
            <Menu.Target>
                <Button variant="subtle" className="relative">
                    <IconBell className="text-foreground" />
                    {isUnseen && (
                        <div className="absolute top-0 right-2 w-3 h-3 bg-primary rounded-full animate-pulse" />
                    )}
                </Button>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Label>
                    <div className="flex justify-between items-center">
                        <p>اخر الاشعارات</p>
                        <Menu.Item
                            onClick={() => {
                                markAllNotificationsAsRead();
                            }}
                            disabled={!isUnseen}
                            variant="transparent"
                            style={{ width: rem(130) }}
                        >
                            <p className="text-left">تحديد الكل كمقروء</p>
                        </Menu.Item>
                    </div>
                </Menu.Label>
                <ScrollArea h={rem(300)}>
                    {flattenNotifications?.map((item, index) => {
                        if (index === flattenNotifications.length - 3) {
                            return (
                                <Menu.Item
                                    onClick={() => {
                                        handleMarkAsRead(item.id, item.seen);
                                    }}
                                    key={item.id}
                                    ref={ref}
                                >
                                    <div
                                        className={cn(
                                            "flex flex-col border border-primary rounded gap-2 mb-2 p-2",
                                            !item.seen && "bg-primary/30"
                                        )}
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <Text size="xs" c="white">
                                                {item.title}
                                            </Text>
                                            <Text size="xs" c="white">
                                                {format(parseISO(item.createdAt), "dd/MM/yyyy HH:mm a", {
                                                    locale: Arabic
                                                })}
                                            </Text>
                                        </div>
                                        <p>{item.content}</p>
                                    </div>
                                </Menu.Item>
                            );
                        }
                        return (
                            <Menu.Item
                                onClick={() => {
                                    handleMarkAsRead(item.id, item.seen);
                                }}
                                key={item.id}
                            >
                                <div
                                    className={cn(
                                        "flex flex-col border border-primary rounded gap-2 mb-2 p-2",
                                        !item.seen && "bg-primary/30"
                                    )}
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <Text size="xs" c="white">
                                            {item.title}
                                        </Text>
                                        <Text size="xs" c="white">
                                            {format(parseISO(item.createdAt), "dd/MM/yyyy")}
                                        </Text>
                                    </div>
                                    <Text>{item.content}</Text>
                                </div>
                            </Menu.Item>
                        );
                    })}
                    <div className="flex justify-center">{isFetchingNextPage && <Loader />}</div>
                </ScrollArea>
            </Menu.Dropdown>
        </Menu>
    );
};
