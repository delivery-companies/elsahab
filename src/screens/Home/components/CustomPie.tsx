import { pieChartData } from "@/lib/getParChartData";
import type { OrdersStatistics } from "@/services/getOrdersStatisticsService";
import { Paper, Text, rem } from "@mantine/core";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export interface CustomPieChartProps {
    labels: string[];
    data: number[];
    additionalData:
        | OrdersStatistics["ordersStatisticsByStatus"]
        | OrdersStatistics["ordersStatisticsByGovernorate"];
    title?: string;
}

export const CustomPieChart = ({ data, labels, additionalData, title }: CustomPieChartProps) => {
    const getTotalCostBuyDataIndex = (index: number) => {
        if (additionalData?.[index]) {
            const dataAtIndex = additionalData[index];
            if ("totalCost" in dataAtIndex) {
                return dataAtIndex.totalCost;
            }
        }
        return "";
    };
    return (
        <>
            {title && (
                <Text size="lg" ta="center" fw="bold" className="mb-4">
                    {title}
                </Text>
            )}
            <Paper withBorder radius="md" p="xs" className="w-full h-full">
                <Pie
                    options={{
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: "top",
                                rtl: true
                            },
                            tooltip: {
                                rtl: true,
                                callbacks: {
                                    label: (context) => {
                                        const label = labels[context.dataIndex];
                                        const value = data[context.dataIndex];
                                        return `${label}: ${value} طلب , التكلفة ${getTotalCostBuyDataIndex(
                                            context.dataIndex
                                        )}`;
                                    }
                                }
                            }
                        }
                    }}
                    width={rem(600)}
                    height={rem(600)}
                    data={pieChartData({ labels, data })}
                />
            </Paper>
        </>
    );
};
