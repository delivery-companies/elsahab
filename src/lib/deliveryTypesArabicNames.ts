enum DeliveryType {
    NORMAL = "عادي",
    REPLACEMENT = "استبدال"
}

export const deliveryTypesArabicNames = {
    NORMAL: "عادي",
    REPLACEMENT: "استبدال"
};

export const deliveryTypesArray: { label: string; value: string }[] = Object.entries(DeliveryType).map(
    ([value, label]) => ({
        label,
        value
    })
);
