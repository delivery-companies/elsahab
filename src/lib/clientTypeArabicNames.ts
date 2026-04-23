enum ClientType {
    CLIENT = "عميل",
    // CLIENT_ASSISTANT = "مساعد عميل"
}

export const clientTypeArabicNames = {
    CLIENT: "عميل",
    // CLIENT_ASSISTANT: "مساعد عميل"
};

export const clientTypeArray: { label: string; value: string }[] = Object.entries(ClientType).map(
    ([value, label]) => ({
        label,
        value
    })
);
