import { useCreateClientReportPDF } from "@/hooks/useCreateClientReportPDF";
import type { ReportsFilters } from "@/services/getReports";
import { useTreasuryReportsStore } from "@/store/treasuryFilters";
import { Button, Menu, rem } from "@mantine/core";
import toast from "react-hot-toast";

interface ReportsStatisticsProps {
    params?: ReportsFilters;
}

export const CreateDocumentationMenu = ({ params }: ReportsStatisticsProps) => {
    const { treasuryReports } = useTreasuryReportsStore();

    const { mutateAsync: crateClientReportPDF, isLoading } = useCreateClientReportPDF();

    const currentPageReportsIDs = treasuryReports.map((report) => Number(report.id));

    const handleExportSelectedReports = () => {
        const selectedReportsIDs = treasuryReports.map((report) => Number(report.id));
        toast.promise(
            crateClientReportPDF({
                reportsIDs: selectedReportsIDs,
                params: params || {}
            }),
            {
                loading: "جاري تحميل تقرير الخزنة...",
                success: "تم تحميل تقرير الخزنة بنجاح",
                error: (error) => error.message || "حدث خطأ ما"
            }
        );
    };

    const handleExportCurrentPage = () => {
        if (!currentPageReportsIDs.length) return;
        toast.promise(
            crateClientReportPDF({
                reportsIDs: currentPageReportsIDs,
                params: params || {}
            }),
            {
                loading: "جاري تحميل تقرير الخزنة...",
                success: "تم تحميل تقرير الخزنة بنجاح",
                error: (error) => error.message || "حدث خطأ ما"
            }
        );
    };

    const handleExportAll = () => {
        toast.promise(
            crateClientReportPDF({
                reportsIDs: "*",
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
                    disabled={treasuryReports?.length === 0 || isLoading}
                    onClick={handleExportSelectedReports}
                >
                    تصدير الصفوف المحددة
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
};
