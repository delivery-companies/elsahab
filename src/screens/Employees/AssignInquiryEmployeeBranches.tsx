import { useBranches } from "@/hooks/useBranches";
import { useEditEmployee } from "@/hooks/useEditEmployee";
import { getSelectOptions } from "@/lib/getSelectOptions";
import { Button, LoadingOverlay, Modal, MultiSelect } from "@mantine/core";
import { useState } from "react";

interface AssignInquiryEmployeeBranchesProps {
    id: number;
    managedBranches: string[];
    opened: boolean;
    close: () => void;
    open: () => void;
    closeMenu: () => void;
}

export const AssignInquiryEmployeeBranches = ({
    id,
    managedBranches,
    close,
    closeMenu,
    open,
    opened
}: AssignInquiryEmployeeBranchesProps) => {
    const { data: branchesData, isLoading: isFetchingStores } = useBranches({
        size: 100000,
        minified: true
    });

    const [selectedBranches, setSelectedBranches] = useState<string[]>(managedBranches);

    const { mutate: editEmployeeBranches, isLoading } = useEditEmployee();

    const handleClose = () => {
        close();
        closeMenu();
    };

    const handleSubmit = () => {
        const selectedBranchesIDs = selectedBranches?.map((store) => Number(store));
        const formData = new FormData();
        formData.append("inquiryBranchesIDs", JSON.stringify(selectedBranchesIDs));
        editEmployeeBranches(
            {
                id,
                data: formData
            },
            {
                onSuccess: () => {
                    close();
                    handleClose();
                },
                onError: () => {
                    setSelectedBranches(managedBranches);
                }
            }
        );
    };

    return (
        <>
            <Modal title="اسناد فروع لموظف دعم" opened={opened} onClose={handleClose} centered>
                <div className="relative">
                    <LoadingOverlay zIndex={10000000000} visible={isFetchingStores} />
                    <MultiSelect
                        value={selectedBranches}
                        label="الفروع"
                        searchable
                        clearable
                        onChange={(e) => {
                            setSelectedBranches(e);
                        }}
                        placeholder="اختر الفرع"
                        data={getSelectOptions(branchesData?.data || [])}
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
                تغيير الفروع
            </Button>
        </>
    );
};
