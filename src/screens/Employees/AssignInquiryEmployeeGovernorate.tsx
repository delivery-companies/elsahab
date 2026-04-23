import { useEditEmployee } from "@/hooks/useEditEmployee";
import { governorateArray } from "@/lib/governorateArabicNames ";
import { Button, Modal, MultiSelect } from "@mantine/core";
import { useState } from "react";

interface AssignInquiryEmployeeToGovernorateProps {
    id: number;
    managedGovernorate: string[];
    opened: boolean;
    close: () => void;
    open: () => void;
    closeMenu: () => void;
}

export const AssignInquiryEmployeeGovernorate = ({
    id,
    managedGovernorate,
    close,
    closeMenu,
    open,
    opened
}: AssignInquiryEmployeeToGovernorateProps) => {
    const [selectedGovernorate, setSelectedGovernorate] = useState<string[]>(managedGovernorate);

    const { mutate: editEmployeeCompanies, isLoading } = useEditEmployee();

    const handleClose = () => {
        close();
        closeMenu();
    };

    const handleSubmit = () => {
        const formData = new FormData();
        formData.append("inquiryGovernorates", JSON.stringify(selectedGovernorate));
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
                    setSelectedGovernorate(managedGovernorate);
                }
            }
        );
    };

    return (
        <>
            <Modal title="اضافة متاجر لمساعد العميل" opened={opened} onClose={handleClose} centered>
                <MultiSelect
                    value={selectedGovernorate}
                    label="المحافظات"
                    searchable
                    clearable
                    onChange={(e) => {
                        setSelectedGovernorate(e);
                    }}
                    placeholder="اختر المحافظة"
                    data={governorateArray}
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
            </Modal>

            <Button fullWidth onClick={open}>
                تغير المحافظات
            </Button>
        </>
    );
};
