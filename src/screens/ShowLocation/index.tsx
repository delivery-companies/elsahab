import { AppLayout } from "@/components/AppLayout";
import { useLocationDetails } from "@/hooks/useLocationDetails";
import { governorateArabicNames } from "@/lib/governorateArabicNames ";
import { Button, MultiSelect, TextInput } from "@mantine/core";
import { ChevronRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export const ShowLocation = () => {
    const { id = "" } = useParams();
    const navigate = useNavigate();
    const { data: locationDetails, isLoading, isError } = useLocationDetails(Number.parseInt(id));
    const locationGovernorate = locationDetails?.data?.governorate
        ? governorateArabicNames[locationDetails?.data?.governorate]
        : "غير معروف";
    const transformedDeliveryAgents = locationDetails?.data?.deliveryAgents.map(
        (deliveryAgent) => deliveryAgent.name
    );

    return (
        <AppLayout isError={isError} isLoading={isLoading}>
            <div className="flex items-center gap-4">
                <ChevronRight
                    size={34}
                    className="mt-3 cursor-pointer"
                    onClick={() => {
                        navigate("/locations");
                    }}
                />
                <h1 className="text-3xl font-semibold">بيانات المنطقة</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
                <TextInput
                    label="الاسم"
                    placeholder=""
                    size="md"
                    className="w-full"
                    value={locationDetails?.data?.name}
                    disabled
                />
                <TextInput value={locationGovernorate} label="المحافظة" disabled />
                <TextInput label="الفرع" value={locationDetails?.data.branch?.name} disabled />
                <MultiSelect value={transformedDeliveryAgents} label="المندوبين" disabled />
                <Button
                    type="submit"
                    fullWidth
                    mt="xl"
                    size="md"
                    onClick={() => {
                        navigate(`/locations/${id}/edit`);
                    }}
                >
                    تعديل
                </Button>
                <Button
                    type="reset"
                    fullWidth
                    mt="xl"
                    size="md"
                    variant="outline"
                    onClick={() => {
                        navigate("/locations");
                    }}
                >
                    الغاء
                </Button>
            </div>
        </AppLayout>
    );
};
