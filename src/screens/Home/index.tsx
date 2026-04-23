import { AppLayout } from "@/components/AppLayout";
import { useOrdersStatistics } from "@/hooks/useOrdersStatistics";
import { governorateArabicNames } from "@/lib/governorateArabicNames ";
import { orderStatusArabicNames } from "@/lib/orderStatusArabicNames";
import type { OrdersStatisticsFilter } from "@/services/getOrdersStatisticsService";
import { Center, Grid, Group, LoadingOverlay, Paper, RingProgress, Skeleton, Text, rem } from "@mantine/core";
import { IconArrowUpRight } from "@tabler/icons-react";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { useState } from "react";
import { CustomPieChart } from "./components/CustomPie";
import { StatisticsFilter } from "./components/StatisticsFilter";

ChartJS.register(ArcElement, Tooltip, Legend);

export const Home = () => {
    const [statisticsFilter, setStatisticsFilter] = useState<OrdersStatisticsFilter>(
        {} as OrdersStatisticsFilter
    );
    const {
        data: ordersStatistics,
        isError,
        isInitialLoading,
        isLoading
    } = useOrdersStatistics(statisticsFilter);
    const ordersStatusStatistics = ordersStatistics?.data.ordersStatisticsByStatus;

    const ordersGovernorateStatistics = ordersStatistics?.data.ordersStatisticsByGovernorate;

    return (
        <AppLayout isError={isError}>
            <StatisticsFilter statisticsFilter={statisticsFilter} setStatisticsFilter={setStatisticsFilter} />
            <div className="relative">
                <LoadingOverlay visible={isInitialLoading} />
                <Grid gutter="lg" className="mt-10 px-2">
                    <Grid.Col className="h-120 mt-4" span={{ sm: 12, md: 6 }}>
                        <CustomPieChart
                            title="الاحصائيات حسب الحالة"
                            data={ordersStatusStatistics?.map((item) => item.count) || []}
                            labels={
                                ordersStatusStatistics?.map((item) => orderStatusArabicNames[item.status]) ||
                                []
                            }
                            additionalData={ordersStatusStatistics || []}
                        />
                    </Grid.Col>
                    <Grid.Col className="h-120 mt-4" span={{ sm: 12, md: 6 }}>
                        <CustomPieChart
                            title="الاحصائيات حسب المحافظة"
                            data={ordersGovernorateStatistics?.map((item) => item.count) || []}
                            labels={
                                ordersGovernorateStatistics?.map(
                                    (item) => governorateArabicNames[item.governorate]
                                ) || []
                            }
                            additionalData={ordersGovernorateStatistics || []}
                        />
                    </Grid.Col>
                    <h1 className="text-lg font-bold mt-10 mr-5 w-full">الاحصائيات الكلية</h1>
                    <Grid.Col className="" span={{ sm: 12, md: 6 }}>
                        <Paper withBorder radius="md" p="xs">
                            <Group>
                                <RingProgress
                                    size={80}
                                    roundCaps
                                    thickness={8}
                                    sections={[{ value: 65, color: "blue" }]}
                                    label={
                                        <Center>
                                            <IconArrowUpRight
                                                style={{ width: rem(20), height: rem(20) }}
                                                stroke={1.5}
                                            />
                                        </Center>
                                    }
                                />

                                <div>
                                    <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                                        عدد الطلبات
                                    </Text>
                                    <Text fw={700} size="xl">
                                        {ordersStatistics?.data.allOrdersStatistics.count}
                                    </Text>
                                </div>
                            </Group>
                        </Paper>
                    </Grid.Col>
                    <Grid.Col className="" span={{ sm: 12, md: 6 }}>
                        <Paper withBorder radius="md" p="xs">
                            <Group>
                                <RingProgress
                                    size={80}
                                    roundCaps
                                    thickness={8}
                                    sections={[{ value: 72, color: "teal" }]}
                                    label={
                                        <Center>
                                            <IconArrowUpRight
                                                style={{ width: rem(20), height: rem(20) }}
                                                stroke={1.5}
                                            />
                                        </Center>
                                    }
                                />

                                <div>
                                    <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                                        التكلفة الكلية
                                    </Text>
                                    <Text fw={700} size="xl">
                                        {ordersStatistics?.data.allOrdersStatistics.totalCost}
                                    </Text>
                                </div>
                            </Group>
                        </Paper>
                    </Grid.Col>
                    <h1 className="text-lg font-bold mt-5 mr-5 w-full">الاحصائيات اليومية</h1>
                    <Grid.Col className="" span={{ sm: 12, md: 6 }}>
                        {isLoading ? (
                            <Skeleton height="100%" />
                        ) : (
                            <Paper withBorder radius="md" p="xs">
                                <Group>
                                    <RingProgress
                                        size={80}
                                        roundCaps
                                        thickness={8}
                                        sections={[{ value: 65, color: "red" }]}
                                        label={
                                            <Center>
                                                <IconArrowUpRight
                                                    style={{ width: rem(20), height: rem(20) }}
                                                    stroke={1.5}
                                                />
                                            </Center>
                                        }
                                    />

                                    <div>
                                        <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                                            عدد الطلبات
                                        </Text>
                                        <Text fw={700} size="xl">
                                            {ordersStatistics?.data.todayOrdersStatistics.count}
                                        </Text>
                                    </div>
                                </Group>
                            </Paper>
                        )}
                    </Grid.Col>
                    <Grid.Col className="" span={{ sm: 12, md: 6 }}>
                        {isLoading ? (
                            <Skeleton height="100%" />
                        ) : (
                            <Paper withBorder radius="md" p="xs">
                                <Group>
                                    <RingProgress
                                        size={80}
                                        roundCaps
                                        thickness={8}
                                        sections={[{ value: 65, color: "violet" }]}
                                        label={
                                            <Center>
                                                <IconArrowUpRight
                                                    style={{ width: rem(20), height: rem(20) }}
                                                    stroke={1.5}
                                                />
                                            </Center>
                                        }
                                    />

                                    <div>
                                        <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                                            التكلفة الكلية
                                        </Text>
                                        <Text fw={700} size="xl">
                                            {ordersStatistics?.data.todayOrdersStatistics.totalCost}
                                        </Text>
                                    </div>
                                </Group>
                            </Paper>
                        )}
                    </Grid.Col>
                    <h1 className="text-lg font-bold mt-5 mr-5 w-full">الاحصائيات بدون كشف عميل</h1>
                    <Grid.Col className="" span={{ sm: 12, md: 6 }}>
                        {isLoading ? (
                            <Skeleton height="100%" />
                        ) : (
                            <Paper withBorder radius="md" p="xs">
                                <Group>
                                    <RingProgress
                                        size={80}
                                        roundCaps
                                        thickness={8}
                                        sections={[{ value: 65, color: "cyan" }]}
                                        label={
                                            <Center>
                                                <IconArrowUpRight
                                                    style={{ width: rem(20), height: rem(20) }}
                                                    stroke={1.5}
                                                />
                                            </Center>
                                        }
                                    />

                                    <div>
                                        <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                                            عدد الطلبات
                                        </Text>
                                        <Text fw={700} size="xl">
                                            {
                                                ordersStatistics?.data.allOrdersStatisticsWithoutClientReport
                                                    .count
                                            }
                                        </Text>
                                    </div>
                                </Group>
                            </Paper>
                        )}
                    </Grid.Col>
                    <Grid.Col className="" span={{ sm: 12, md: 6 }}>
                        {isLoading ? (
                            <Skeleton height="100%" />
                        ) : (
                            <Paper withBorder radius="md" p="xs">
                                <Group>
                                    <RingProgress
                                        size={80}
                                        roundCaps
                                        thickness={8}
                                        sections={[{ value: 65, color: "yellow" }]}
                                        label={
                                            <Center>
                                                <IconArrowUpRight
                                                    style={{ width: rem(20), height: rem(20) }}
                                                    stroke={1.5}
                                                />
                                            </Center>
                                        }
                                    />

                                    <div>
                                        <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                                            التكلفة الكلية
                                        </Text>
                                        <Text fw={700} size="xl">
                                            {
                                                ordersStatistics?.data.allOrdersStatisticsWithoutClientReport
                                                    .totalCost
                                            }
                                        </Text>
                                    </div>
                                </Group>
                            </Paper>
                        )}
                    </Grid.Col>
                </Grid>
            </div>
        </AppLayout>
    );
};
