import { useEditEmployee } from "@/hooks/useEditEmployee";
import { useTenants } from "@/hooks/useTenants";
import { getSelectOptions } from "@/lib/getSelectOptions";
import { Button, LoadingOverlay, Modal, MultiSelect } from "@mantine/core";
import { useState } from "react";

interface AssignInquiryEmployeeToCompaniesProps {
    id: number;
    managedCompanies: string[];
    opened: boolean;
    close: () => void;
    open: () => void;
    closeMenu: () => void;
}

export const AssignInquiryEmployeeCompanies = ({
    id,
    managedCompanies,
    close,
    closeMenu,
    open,
    opened
}: AssignInquiryEmployeeToCompaniesProps) => {
    const { data: companies, isLoading: isFetchingCompaniesLoading } = useTenants({
        size: 100000,
        minified: true
    });

    const [selectedCompanies, setSelectedCompanies] = useState<string[]>(managedCompanies);

    const { mutate: editEmployeeCompanies, isLoading } = useEditEmployee();

    const handleClose = () => {
        close();
        closeMenu();
    };

    const handleSubmit = () => {
        const selectedCompaniesIDs = selectedCompanies?.map((company) => Number(company));
        const formData = new FormData();
        formData.append("inquiryCompaniesIDs", JSON.stringify(selectedCompaniesIDs));
        editEmployeeCompanies(
            {
                id,
                data: formData
            },
            {
                onSuccess: () => {
                    handleClose();
                },
                onError: () => {
                    setSelectedCompanies(managedCompanies);
                }
            }
        );
    };

    return (
        <>
            <Modal title="اضافة متاجر لمساعد العميل" opened={opened} onClose={handleClose} centered>
                <div className="relative">
                    <LoadingOverlay zIndex={10000000000} visible={isFetchingCompaniesLoading} />
                    <MultiSelect
                        value={selectedCompanies}
                        label="الشركات"
                        searchable
                        clearable
                        onChange={(e) => {
                            setSelectedCompanies(e);
                        }}
                        placeholder="اختر الشركة"
                        data={getSelectOptions(companies?.data || [])}
                        limit={100}
                    />
                    <div className="flex justify-between mt-4 gap-6">
                        <Button
                            loading={false}
                            disabled={isLoading}
                            fullWidth
                            onClick={handleSubmit}
                            type="submit"
                        >
                            تعديل
                        </Button>

                        <Button
                            onClick={() => {
                                handleClose();
                            }}
                            fullWidth
                            variant="outline"
                        >
                            الغاء
                        </Button>
                    </div>
                </div>
            </Modal>

            <Button fullWidth onClick={open}>
                تغير الشركات
            </Button>
        </>
    );
};
