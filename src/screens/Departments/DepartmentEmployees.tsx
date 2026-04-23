import { useAssignEmployeesToDepartment } from "@/hooks/useDepartments";
import { useEmployees } from "@/hooks/useEmployees";
import { getSelectOptions } from "@/lib/getSelectOptions";
import { Button, LoadingOverlay, Modal, MultiSelect } from "@mantine/core";
import { useState } from "react";

interface AssignInquiryEmployeeDepartmentProps {
    id: number;
    managedEmployees: string[];
    opened: boolean;
    close: () => void;
    open: () => void;
}

export const AssignInquiryEmployeeDepartment = ({
    id,
    managedEmployees,
    close,
    open,
    opened
}: AssignInquiryEmployeeDepartmentProps) => {
    const { data: employeesData, isLoading: isFetching } = useEmployees({
        size: 100000,
        minified: true,
        roles:["INQUIRY_EMPLOYEE"]
    });

    const [selectedEmployees, setSelectedEmployees] = useState<string[]>(managedEmployees);

    const { mutate: editEmployeesDepartment, isLoading } = useAssignEmployeesToDepartment();

    const handleClose = () => {
        close();
    };

    const handleSubmit = () => {
        const selectedBranchesIDs = selectedEmployees?.map((store) => Number(store));
        const formData = new FormData();
        formData.append("employeesIds", JSON.stringify(selectedBranchesIDs));
        formData.append("departmentId", id+"");
        
        editEmployeesDepartment(
                formData
            ,
            {
                onSuccess: () => {
                    close();
                    handleClose();
                },
                onError: () => {
                    setSelectedEmployees(managedEmployees);
                }
            }
        );
    };

    return (
        <>
            <Modal title="اسناد موظفين لقسم دعم" opened={opened} onClose={handleClose} centered>
                <div className="relative">
                    <LoadingOverlay zIndex={10000000000} visible={isFetching} />
                    <MultiSelect
                        value={selectedEmployees}
                        label="الموظفين"
                        searchable
                        clearable
                        onChange={(e) => {
                            setSelectedEmployees(e);
                        }}
                        placeholder="اختر الفرع"
                        data={getSelectOptions(employeesData?.data || [])}
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

                        <Button onClick={handleClose} fullWidth variant="outline">
                            الغاء
                        </Button>
                    </div>
                </div>
            </Modal>

            <Button fullWidth onClick={open}>
                تغيير الموظفين
            </Button>
        </>
    );
};
