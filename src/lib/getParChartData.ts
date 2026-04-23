import type { ChartData } from "chart.js";

const statusColors = [
    "rgba(255, 0, 0, 1)",
    "rgba(0, 255, 0, 1)",
    "rgba(0, 0, 255, 1)",
    "rgba(255, 255, 0, 1)",
    "rgba(255, 0, 255, 1)",
    "rgba(0, 255, 255, 1)",
    "rgba(128, 0, 128, 1)",
    "rgba(255, 165, 0, 1)",
    "rgba(0, 128, 0, 1)",
    "rgba(128, 128, 0, 1)",
    "rgba(0, 128, 128, 1)",
    "rgba(128, 0, 0, 1)"
];

export const pieChartData = ({
    labels,
    data
}: {
    labels: string[];
    data: number[];
}): ChartData<"pie", number[], string> => {
    return {
        labels,
        datasets: [
            {
                label: "عدد الطلبات",
                data,
                backgroundColor: statusColors,
                borderColor: statusColors.map((color) => color.replace("0.6", "1")),
                borderWidth: 1
            }
        ]
    };
};
