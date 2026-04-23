enum ReportType {
    COMPANY = "شركة",
    REPOSITORY = "مخزن",
    GOVERNORATE = "محافظة",
    DELIVERY_AGENT = "مندوب توصيل",
    BRANCH = "فرع",
    CLIENT = "عميل"
}

export const reportTypeArabicNames = {
    COMPANY: "شركة",
    REPOSITORY: "مخزن",
    GOVERNORATE: "محافظة",
    DELIVERY_AGENT: "مندوب توصيل",
    BRANCH: "فرع",
    CLIENT: "عميل"
};

export const reportTypeArray: { label: string; value: string }[] = Object.entries(ReportType).map(
    ([value, label]) => ({
        label,
        value
    })
);
