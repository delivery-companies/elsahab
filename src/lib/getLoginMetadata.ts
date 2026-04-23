import { browserName } from "react-device-detect";

interface IPLocation {
    ip: string;
    network: string;
    version: string;
    city: string;
    region: string;
    region_code: string;
    country: string;
    country_name: string;
    country_code: string;
    country_code_iso3: string;
    country_capital: string;
    country_tld: string;
    continent_code: string;
    in_eu: boolean;
    postal: string | null;
    latitude: number;
    longitude: number;
    timezone: string;
    utc_offset: string;
    country_calling_code: string;
    currency: string;
    currency_name: string;
    languages: string;
    country_area: number;
    country_population: number;
    asn: string;
    org: string;
}

export interface LoginMetadata {
    ip: string | undefined;
    device: string | undefined;
    platform: string | undefined;
    browser: string | undefined;
    location: string | undefined;
}

const getIPMetadata = async (): Promise<IPLocation> => {
    const response = await fetch("https://ipapi.co/json/");
    return response.json();
};

const getCurrentDevice = () => {
    const ua = navigator.userAgent;
    if (/mobi/i.test(ua)) return "Mobile";
    if (/tablet/i.test(ua)) return "Tablet";
    return "Desktop";
};

const getCurrentPlatform = () => {
    const ua = navigator.userAgent;
    if (/mac/i.test(ua)) return "Mac";
    if (/win/i.test(ua)) return "Windows";
    if (/linux/i.test(ua)) return "Linux";
    if (/android/i.test(ua)) return "Android";
    if (/ios/i.test(ua)) return "iOS";
    return "Unknown";
};

// get location from navigator.geolocation
const getLocation = async (): Promise<GeolocationPosition | ""> => {
    return new Promise((resolve, _reject) => {
        navigator.geolocation.getCurrentPosition(
            (position) => resolve(position),
            () => resolve("")
        );
    });
};

export const getLoginMetadata = async () => {
    const ipMetadata = await getIPMetadata();
    const currentDevice = getCurrentDevice();
    const currentPlatform = getCurrentPlatform();
    const location = await getLocation();

    return {
        ip: `${ipMetadata.ip}`,
        device: currentDevice,
        platform: currentPlatform,
        browser: browserName,
        location:
            location !== ""
                ? `${location.coords.latitude},${location.coords.longitude}`
                : `${ipMetadata.latitude},${ipMetadata.longitude}`
    } satisfies LoginMetadata;
};
