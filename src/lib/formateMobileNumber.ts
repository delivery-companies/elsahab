export const formatMobileNumber = (mobileNumber: string) => {
    const match = mobileNumber.match(/^(\d{4})(\d{3})(\d{4})$/);
    if (!match) {
        return mobileNumber;
    }
    return `${match[1]}-${match[2]}-${match[3]}`;
};
