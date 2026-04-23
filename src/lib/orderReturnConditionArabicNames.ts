// export type ReturnCondition = 'WITH_AGENT' | 'IN_REPOSITORY';

export const orderReturnConditionArabicNames = {
    WITH_AGENT: "مع المندوب",
    IN_REPOSITORY: "في المخزن"
};

export enum OrderReturnConditionEnum {
    WITH_AGENT = "مع المندوب",
    IN_REPOSITORY = "في المخزن"
}

export const orderReturnConditionArray: { label: string; value: string }[] = Object.entries(
    OrderReturnConditionEnum
).map(([value, label]) => ({
    label,
    value
}));
