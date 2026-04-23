import { iraqiPhoneRegex } from "./regex";

export const isValidIraqiPhoneNumber = (value: string) => {
    return iraqiPhoneRegex.test(value);
};
