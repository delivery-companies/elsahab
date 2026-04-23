export const governorateArabicNames = {
    AL_ANBAR: "الأنبار",
    BABIL: "بابل",
    BAGHDAD: "بغداد",
    BASRA: "البصرة",
    DHI_QAR: "ذي قار",
    AL_QADISIYYAH: "القادسية",
    DIYALA: "ديالى",
    DUHOK: "دهوك",
    ERBIL: "أربيل",
    KARBALA: "كربلاء",
    KIRKUK: "كركوك",
    MAYSAN: "ميسان",
    MUTHANNA: "المثنى",
    NAJAF: "النجف",
    NINAWA: "نينوى",
    SALAH_AL_DIN: "صلاح الدين",
    SULAYMANIYAH: "السليمانية",
    WASIT: "واسط",
    BABIL_COMPANIES: "شركات بابل"
};

export enum GovernorateEnum {
    AL_ANBAR = "الأنبار",
    BABIL = "بابل",
    BAGHDAD = "بغداد",
    BASRA = "البصرة",
    DHI_QAR = "ذي قار",
    AL_QADISIYYAH = "القادسية",
    DIYALA = "ديالى",
    DUHOK = "دهوك",
    ERBIL = "أربيل",
    KARBALA = "كربلاء",
    KIRKUK = "كركوك",
    MAYSAN = "ميسان",
    MUTHANNA = "المثنى",
    NAJAF = "النجف",
    NINAWA = "نينوى",
    SALAH_AL_DIN = "صلاح الدين",
    SULAYMANIYAH = "السليمانية",
    WASIT = "واسط",
    BABIL_COMPANIES = "شركات بابل"
}

export const governorateArray: { label: string; value: string }[] = Object.entries(GovernorateEnum).map(
    ([value, label]) => ({
        label,
        value
    })
);
