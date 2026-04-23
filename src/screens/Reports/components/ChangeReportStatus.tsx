import { useEditReport } from "@/hooks/useEditReport";
import type { ChangeReportStatusPayload } from "@/services/editReportService";
import { Switch } from "@mantine/core";
import toast from "react-hot-toast";

export const ChangeReportStatus = ({
    id,
    initialStatus
}: {
    id: number;
    initialStatus: ChangeReportStatusPayload["status"];
}) => {
    const { mutate: changeReportStatus } = useEditReport();

    const handleEdit = (status: "UNPAID" | "PAID") => {
        changeReportStatus(
            { status, id },
            {
                onSuccess: () => {
                    toast.success("تم تغيير حالة الكشف بنجاح");
                }
            }
        );
    };

    return (
        <Switch
            className="my-3"
            checked={initialStatus === "PAID"}
            label={initialStatus === "PAID" ? "مدفوع" : "غير مدفوع"}
            onChange={(event) => {
                handleEdit(event.target.checked ? "PAID" : "UNPAID");
            }}
        />
    );
};
