import { AppLayout } from "@/components/AppLayout";
import { useRepositoryDetails } from "@/hooks/useRepositoryDetails";
import { Autocomplete, Button, Select, Switch, TextInput } from "@mantine/core";
import { ChevronRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export const ShowRepository = () => {
    const { id = "" } = useParams();
    const navigate = useNavigate();
    const { data: repositoryDetails, isLoading, isError } = useRepositoryDetails(Number.parseInt(id));

    return (
        <AppLayout isLoading={isLoading} isError={isError}>
            <div className="flex items-center gap-4">
                <ChevronRight
                    size={34}
                    className="mt-2 cursor-pointer"
                    onClick={() => {
                        navigate("/repositories");
                    }}
                />
                <h1 className="text-3xl font-semibold">بيانات مخزن</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
                <TextInput
                    label="الاسم"
                    placeholder=""
                    size="md"
                    className="w-full"
                    value={repositoryDetails?.data?.name}
                    disabled
                />
                <Autocomplete
                    label="الفرع"
                    placeholder="اختار الفرع"
                    value={repositoryDetails?.data?.branch.name}
                    disabled
                />
                <Select
                    clearable
                    label="نوع المخزن"
                    size="sm"
                    placeholder="اختار اختار النوع"
                    data={[{label:"مخزن صادر",value:"EXPORT"},{label:"مخزن راجع",value:"RETURN"}]}
                    limit={100}
                    value={repositoryDetails?.data?.type}
                    disabled
                />
                <Switch                    
                    checked={repositoryDetails?.data?.mainRepository}
                    label="مخزن رئيسي"
                    className="mt-6"
                    disabled
                />
                <Button
                    type="submit"
                    fullWidth
                    mt="xl"
                    size="md"
                    onClick={() => {
                        navigate(`/repositories/${id}/edit`);
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
                        navigate("/repositories");
                    }}
                >
                    الغاء
                </Button>
            </div>
        </AppLayout>
    );
};
