import { AppLayout } from "@/components/AppLayout";
import { useBranchDetails } from "@/hooks/useBranchDetails";
import { governorateArray } from "@/lib/governorateArabicNames ";
import { Autocomplete, Button, TextInput } from "@mantine/core";
import { ChevronRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export const ShowBranch = () => {
    const { id = "" } = useParams();
    const navigate = useNavigate();
    const { data: branchDetails, isLoading, isError } = useBranchDetails(Number.parseInt(id));

    const transformedLocation = governorateArray.find(
        (item) => item.value === branchDetails?.data?.governorate
    );

    return (
        <AppLayout isLoading={isLoading} isError={isError}>
            <div className="flex items-center gap-4">
                <ChevronRight
                    size={34}
                    className="mt-2 cursor-pointer"
                    onClick={() => {
                        navigate("/branches");
                    }}
                />
                <h1 className="text-3xl font-semibold">اضافة فرع</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
                <TextInput
                    label="الاسم"
                    placeholder=""
                    size="md"
                    className="w-full"
                    value={branchDetails?.data?.name}
                    disabled
                />
                <Autocomplete
                    label="الفرع"
                    placeholder="اختار الفرع"
                    data={governorateArray}
                    value={transformedLocation?.label}
                    disabled
                />
                <TextInput
                    label="البريد الالكتروني"
                    placeholder=""
                    size="md"
                    className="w-full"
                    value={branchDetails?.data?.email}
                    disabled
                />
                <TextInput
                    label="رقم الهاتف"
                    placeholder=""
                    size="md"
                    className="w-full"
                    value={branchDetails?.data?.phone}
                    disabled
                />
                <Button
                    type="submit"
                    fullWidth
                    mt="xl"
                    size="md"
                    onClick={() => {
                        navigate(`/branches/${id}/edit`);
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
                        navigate("/branches");
                    }}
                >
                    الغاء
                </Button>
            </div>
        </AppLayout>
    );
};
