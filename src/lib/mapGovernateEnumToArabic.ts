import { governorateArabicNames } from "./governorateArabicNames ";

export const mapEnumToArabic = (enumValue: keyof typeof governorateArabicNames) => {
    return governorateArabicNames[enumValue] || enumValue;
};
