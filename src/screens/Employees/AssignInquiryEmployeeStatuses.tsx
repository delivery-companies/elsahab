import { useEditEmployee } from "@/hooks/useEditEmployee";
import { orderStatusArray } from "@/lib/orderStatusArabicNames";
import { Button, Modal, MultiSelect } from "@mantine/core";
import { useState } from "react";

interface AssignInquiryEmployeeStatusesProps {
    id: number;
    managedStatuses: string[];
    opened: boolean;
    close: () => void;
    open: () => void;
    closeMenu: () => void;
}

export const AssignInquiryEmployeeStatuses = ({
    id,
    managedStatuses,
    close,
    closeMenu,
    open,
    opened
}: AssignInquiryEmployeeStatusesProps) => {
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>(managedStatuses);

    const { mutate: editEmployeeCompanies, isLoading } = useEditEmployee();

    const handleClose = () => {
        close();
        closeMenu();
    };

    const handleSubmit = () => {
        const formData = new FormData();
        formData.append("inquiryStatuses", JSON.stringify(selectedStatuses));
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
                    setSelectedStatuses(managedStatuses);
                }
            }
        );
    };

    return (
        <>
            <Modal title="اضافة متاجر لمساعد العميل" opened={opened} onClose={handleClose} centered>
                <MultiSelect
                    value={selectedStatuses}
                    label="الحالات"
                    searchable
                    clearable
                    onChange={(e) => {
                        setSelectedStatuses(e);
                    }}
                    placeholder="اختر الحالة"
                    data={orderStatusArray}
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
                تغير الحالات
            </Button>
        </>
    );
};
