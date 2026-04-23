enum ReportStatus {
    UNPAID = "غير مدفوع",
    PAID = "مدفوع"
}

export const reportStatusArabicNames = {
    UNPAID: "غير مدفوع",
    PAID: "مدفوع"
};

export const reportStatusArray: { label: string; value: string }[] = Object.entries(ReportStatus).map(
    ([value, label]) => ({
        label,
        value
    })
);
