enum OrderSecondaryStatus {
    WITH_CLIENT = "مع العميل",
    IN_CAR= "في الطريق",
    WITH_AGENT = "مع المندوب",
    IN_REPOSITORY = "في المخزن"
    
}

export const orderSecondaryStatusArabicNames = {
    WITH_CLIENT: "مع العميل",
    WITH_AGENT: "مع المندوب",
    IN_CAR: "في الطريق",
    IN_REPOSITORY: "في المخزن"
};

export const orderSecondaryStatusArray: { label: string; value: string }[] = Object.entries(
    OrderSecondaryStatus
).map(([value, label]) => ({
    label,
    value
}));
