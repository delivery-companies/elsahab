import { useCreateClientReportPDF } from "@/hooks/useCreateClientReportPDF";
import type { ReportsFilters, ReportsMetaData } from "@/services/getReports";
import { useClientReportStoreStore } from "@/store/useClientReportsStore";
import { Button, Grid, Menu, rem } from "@mantine/core";
import toast from "react-hot-toast";
import { StatisticsItem } from "./StatisticsItem";

interface ReportsStatisticsProps {
    reportsMetaData?: ReportsMetaData;
    currentPageReportsIDs?: number[];
    params?: ReportsFilters;
    tapType?: "CLIENT";
}

export const ReportsStatistics = ({
    reportsMetaData,
    currentPageReportsIDs,
    params,
    tapType
}: ReportsStatisticsProps) => {
    const { mutateAsync: crateClientReportPDF, isLoading } = useCreateClientReportPDF();
    const { reports } = useClientReportStoreStore();

    const handleExportSelectedReports = () => {
        const selectedReportsIDs = reports.map((report) => Number(report.id));
        toast.promise(crateClientReportPDF({ reportsIDs: selectedReportsIDs, type: "CLIENT" }), {
            loading: "جاري تحميل تقرير العميل...",
            success: "تم تحميل تقرير العميل بنجاح",
            error: (error) => error.message || "حدث خطأ ما"
        });
    };

    const handleExportCurrentPage = () => {
        if (!currentPageReportsIDs) return;
        toast.promise(
            crateClientReportPDF({
                reportsIDs: currentPageReportsIDs,
                type: "CLIENT"
            }),
            {
                loading: "جاري تحميل تقرير العميل...",
                success: "تم تحميل تقرير العميل بنجاح",
                error: (error) => error.message || "حدث خطأ ما"
            }
        );
    };

    const handleExportAll = () => {
        toast.promise(
            crateClientReportPDF({
                reportsIDs: "*",
                type: "CLIENT",
                params: params || {}
            }),
            {
                loading: "جاري تحميل جميع تقرير العميل...",
                success: "تم تحميل جميع تقرير العميل بنجاح",
                error: (error) => error.message || "حدث خطأ ما"
            }
        );
    };

    return (
        <Grid grow>
            <Grid.Col span={{ base: 6, xs: 3, sm: 3, md: 2, lg: 2, xl: 1 }}>
                <StatisticsItem
                    title="العدد الكلي للطلبات"
                    value={
                        (reportsMetaData?.baghdadOrdersCount || 0) +
                        (reportsMetaData?.governoratesOrdersCount || 0)
                    }
                />
            </Grid.Col>
            <Grid.Col span={{ base: 6, xs: 3, sm: 3, md: 2, lg: 2, xl: 1 }}>
                <StatisticsItem title="عدد طلبات بغداد" value={reportsMetaData?.baghdadOrdersCount || 0} />
            </Grid.Col>
            <Grid.Col span={{ base: 6, xs: 3, sm: 3, md: 2, lg: 2, xl: 1 }}>
                <StatisticsItem
                    title="عدد طلبات المحافظات"
                    value={reportsMetaData?.governoratesOrdersCount || 0}
                />
            </Grid.Col>
            <Grid.Col span={{ base: 6, xs: 3, sm: 3, md: 2, lg: 2, xl: 1 }}>
                <StatisticsItem title="عدد الكشوفات" value={reportsMetaData?.reportsCount || 0} />
            </Grid.Col>
            <Grid.Col span={{ base: 6, xs: 3, sm: 3, md: 2, lg: 2, xl: 1 }}>
                <StatisticsItem title="التكلفة الكلية" value={reportsMetaData?.totalCost || 0} />
            </Grid.Col>
            <Grid.Col span={{ base: 6, xs: 3, sm: 3, md: 2, lg: 2, xl: 1 }}>
                <StatisticsItem title="المبلغ المدفوع" value={reportsMetaData?.paidAmount || 0} />
            </Grid.Col>
            <Grid.Col span={{ base: 6, xs: 3, sm: 3, md: 2, lg: 2, xl: 1 }}>
                <StatisticsItem title="تكلفة التوصيل" value={reportsMetaData?.deliveryCost || 0} />
            </Grid.Col>
            <Grid.Col span={{ base: 6, xs: 3, sm: 3, md: 2, lg: 2, xl: 1 }}>
                <StatisticsItem title="صافي العميل" value={reportsMetaData?.clientNet || 0} />
            </Grid.Col>
            <Grid.Col span={{ base: 6, xs: 3, sm: 3, md: 2, lg: 2, xl: 1 }}>
                <StatisticsItem title="صافي الشركة" value={reportsMetaData?.companyNet || 0} />
            </Grid.Col>
            <Grid.Col span={{ base: 6, xs: 3, sm: 3, md: 2, lg: 2, xl: 1 }}>
                <StatisticsItem title="صافي المندوب" value={reportsMetaData?.deliveryAgentNet || 0} />
            </Grid.Col>
            {tapType === "CLIENT" && (
                <Grid.Col span={12}>
                    <Menu shadow="md" width={rem(180)}>
                        <Menu.Target>
                            <Button>انشاء تقارير</Button>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Label>اختار النوع</Menu.Label>
                            <Menu.Item disabled={isLoading} onClick={handleExportAll}>
                                تصدير الكل{" "}
                            </Menu.Item>
                            <Menu.Item
                                disabled={currentPageReportsIDs?.length === 0 || isLoading}
                                onClick={handleExportCurrentPage}
                            >
                                تصدير الصفحة الحالية
                            </Menu.Item>
                            <Menu.Item
                                disabled={reports.length === 0 || isLoading}
                                onClick={handleExportSelectedReports}
                            >
                                تصدير الصفوف المحددة
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Grid.Col>
            )}
        </Grid>
    );
};
