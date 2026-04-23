enum OrderStatus {
    REGISTERED = "تم الطلب",
    READY_TO_SEND = "جاهز للأرسال",
    WITH_DELIVERY_AGENT = "بالطريق مع المندوب",
    DELIVERED = "تم التوصيل",
    REPLACED = "تم الاستبدال",
    PARTIALLY_RETURNED = "مرتجع جزئي",
    RETURNED = "راجع كلي",
    POSTPONED = "مؤجل",
    CHANGE_ADDRESS = "تغيير عنوان",
    RESEND = "إعادة إرسال",
    WITH_RECEIVING_AGENT = "مع مندوب الاستلام",
    IN_MAIN_REPOSITORY = "مخزن الفرز الرئيسي",
    IN_GOV_REPOSITORY = "مخزن فرز المحافظه",
    PROCESSING = "قيد المعالجه"
}

export const orderStatusArabicNames = {
    REGISTERED: "تم الطلب",
    READY_TO_SEND: "جاهز للأرسال",
    WITH_DELIVERY_AGENT: "بالطريق مع المندوب",
    DELIVERED: "تم التوصيل",
    REPLACED: "تم الاستبدال",
    PARTIALLY_RETURNED: "مرتجع جزئي",
    RETURNED: "راجع كلي",
    POSTPONED: "مؤجل",
    CHANGE_ADDRESS: "تغيير عنوان",
    RESEND: "إعادة إرسال",
    WITH_RECEIVING_AGENT: "مع مندوب الاستلام",
    PROCESSING: "قيد المعالجه",
    IN_MAIN_REPOSITORY :"مخزن الفرز الرئيسي",
    IN_GOV_REPOSITORY :"مخزن فرز المحافظه",
};

export const orderStatusColors = {
    REGISTERED: "#3498db", // Blue – New order
    READY_TO_SEND: "#2980b9", // Darker Blue – Ready
    WITH_DELIVERY_AGENT: "#f1c40f", // Yellow – In transit
    DELIVERED: "#2ecc71", // Green – Delivered
    REPLACED: "#8e44ad", // Purple – Replaced
    PARTIALLY_RETURNED: "#e67e22", // Orange – Partial return
    RETURNED: "#e74c3c", // Red – Returned
    POSTPONED: "#95a5a6", // Gray – Postponed
    CHANGE_ADDRESS: "#16a085", // Teal – Address changed
    RESEND: "#d35400", // Dark Orange – Resend
    WITH_RECEIVING_AGENT: "#f39c12", // Amber – With pickup agent
    PROCESSING: "#9b59b6", // Violet – Processing
    IN_MAIN_REPOSITORY: "#34495e", // Dark Blue-Gray – Main warehouse
    IN_GOV_REPOSITORY: "#7f8c8d", // Gray – Governorate warehouse
};

export const orderStatusArray: { label: string; value: string }[] = Object.entries(OrderStatus).map(
    ([value, label]) => ({
        label,
        value
    })
);
