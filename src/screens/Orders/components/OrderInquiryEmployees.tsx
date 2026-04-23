import { UserInfoIcons } from "@/components/InquiryEmployeeCard";
import { useBranches } from "@/hooks/useBranches";
import { useEditOrder } from "@/hooks/useEditOrder";
import { useEmployees } from "@/hooks/useEmployees";
import { useLocations } from "@/hooks/useLocations";
import { getSelectOptions } from "@/lib/getSelectOptions";
import { Button, type ComboboxItem, Grid, LoadingOverlay, Modal, Select } from "@mantine/core";
import { useRef, useState } from "react";

type PartialInquiryEmployee = {
    id: number;
    name: string;
}[];

interface Props {
    orderID: string;
    inquiryEmployees: PartialInquiryEmployee;
    opened: boolean;
    close: () => void;
    open: () => void;
    closeMenu: () => void;
}

export const OrderInquiryEmployees = ({
    close,
    inquiryEmployees,
    open,
    opened,
    orderID,
    closeMenu
}: Props) => {
    const selectRef = useRef<HTMLInputElement>(null);
    const [selectedEmployees, setSelectedEmployees] = useState<PartialInquiryEmployee>(inquiryEmployees);
    const [selectedEmployee, setSelectedEmployee] = useState<ComboboxItem | null>();

    const [selectedBranch, setSelectedBranch] = useState<ComboboxItem | null>();
    const [selectedLocation, setSelectedLocation] = useState<string | null>();

    const { data: inquiryEmployee, isInitialLoading: isInquiryEmployeesLoading } = useEmployees({
        size: 100000,
        roles: ["INQUIRY_EMPLOYEE"],
        branch_id: selectedBranch ? selectedBranch.value : null,
        location_id: selectedLocation,
        minified: true
    });

    const { data: branchesData } = useBranches({
        size: 100000,
        minified: true
    });
    const { data: locationsData } = useLocations(
        {
            size: 100000,
            minified: true
        },
        !!selectedBranch
    );

    const { mutate: editInquiryEmployees, isLoading: isEditLoading } = useEditOrder();

    const handleAddEmployee = (employee: ComboboxItem) => {
        if (selectedEmployees?.find((emp) => emp?.id === Number(employee.value))) {
            return;
        }
        setSelectedEmployees([
            ...selectedEmployees,
            {
                id: Number(employee.value),
                name: employee.label
            }
        ]);
    };

    const handleRemoveEmployee = (employeeId: string) => {
        const filteredEmployees = selectedEmployees.filter((employee) => employee?.id !== Number(employeeId));
        setSelectedEmployees(filteredEmployees);
    };

    const handleEdit = () => {
        if (selectedEmployees) {
            const inquiryEmployeesIDs = selectedEmployees.map(
                (employee) => (employee?.id && employee.id) || 0
            );
            editInquiryEmployees(
                {
                    id: orderID,
                    data: {
                        inquiryEmployeesIDs
                    }
                },
                {
                    onSuccess: () => {
                        close();
                        closeMenu();
                    }
                }
            );
        }
    };

    return (
        <>
            <Button variant="outline" onClick={open}>
                تغيير موظفي الدعم
            </Button>
            <Modal
                title="تغيير  موظفي الدعم"
                opened={opened}
                onClose={() => {
                    close();
                    closeMenu();
                }}
                centered
                size="65%"
                className="relative"
            >
                <LoadingOverlay visible={isInquiryEmployeesLoading} />
                <Grid className="my-6">
                    <Grid.Col span={{ base: 12, sm: 12, xs: 12, md: 6, lg: 6 }}>
                        <Select
                            label="الفروع"
                            data={getSelectOptions(branchesData?.data || [])}
                            clearable
                            searchable
                            limit={50}
                            placeholder="اختار الفرع"
                            value={selectedBranch ? selectedBranch.value : null}
                            onChange={(_, option) => {
                                setSelectedBranch(option);
                            }}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 12, xs: 12, md: 6, lg: 6 }}>
                        <Select
                            label="المناطق"
                            data={getSelectOptions(locationsData?.data || [])}
                            clearable
                            limit={50}
                            searchable
                            placeholder="اختار المنطقة"
                            disabled={!selectedBranch}
                            value={selectedLocation}
                            onChange={(e) => {
                                setSelectedLocation(e);
                            }}
                        />
                    </Grid.Col>
                    <Grid.Col span={12}>
                        <Select
                            label="موظفي الدعم"
                            data={getSelectOptions(inquiryEmployee?.data || [])}
                            clearable
                            searchable
                            checkIconPosition="right"
                            allowDeselect={false}
                            limit={50}
                            value={selectedEmployee ? selectedEmployee.value : null}
                            onChange={(_, option) => {
                                handleAddEmployee(option);
                                setSelectedEmployee(null);
                                selectRef.current?.blur();
                            }}
                        />
                    </Grid.Col>
                </Grid>
                <Grid grow>
                    {selectedEmployees.length ? (
                        selectedEmployees.map((employee) => (
                            <Grid.Col
                                span={{
                                    xs: 12,
                                    sm: 12,
                                    md: 4,
                                    lg: 3
                                }}
                                key={employee?.id}
                            >
                                <UserInfoIcons
                                    onclick={() => {
                                        if (employee?.id) {
                                            handleRemoveEmployee(employee?.id.toString());
                                        }
                                    }}
                                    {...employee}
                                />
                            </Grid.Col>
                        ))
                    ) : (
                        <div className="flex flex-1 justify-center items-center my-10 border-4 border-dashed h-20">
                            <p className="text-center font-bold">لا يوجد موظفي دعم</p>
                        </div>
                    )}
                </Grid>

                <div className="mt-4 flex items-center gap-4">
                    <Button
                        loading={isEditLoading}
                        disabled={isEditLoading}
                        onClick={handleEdit}
                        fullWidth
                        variant="filled"
                    >
                        تعديل
                    </Button>
                    <Button fullWidth variant="outline" onClick={close} className="mr-4">
                        إلغاء
                    </Button>
                </div>
            </Modal>
        </>
    );
};
