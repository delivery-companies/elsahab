import { useEditEmployee } from "@/hooks/useEditEmployee";
import { useLocations } from "@/hooks/useLocations";
import { getSelectOptions } from "@/lib/getSelectOptions";
import { Button, LoadingOverlay, Modal, MultiSelect } from "@mantine/core";
import { useState } from "react";

interface AssignInquiryEmployeeLocationsProps {
    id: number;
    managedLocations: string[];
    opened: boolean;
    close: () => void;
    open: () => void;
    closeMenu: () => void;
}

export const AssignInquiryEmployeeLocations = ({
    id,
    managedLocations,
    close,
    closeMenu,
    open,
    opened
}: AssignInquiryEmployeeLocationsProps) => {
    const { data: locationsData, isLoading: isFetchingLocations } = useLocations({
        size: 100000,
        minified: true
    });

    const [selectedLocations, setSelectedLocations] = useState<string[]>(managedLocations);

    const { mutate: editEmployeeLocations, isLoading } = useEditEmployee();

    const handleClose = () => {
        close();
        closeMenu();
    };

    const handleSubmit = () => {
        const selectedLocationsIDs = selectedLocations?.map((location) => Number(location));
        const formData = new FormData();
        formData.append("inquiryLocationsIDs", JSON.stringify(selectedLocationsIDs));
        editEmployeeLocations(
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
                    setSelectedLocations(managedLocations);
                }
            }
        );
    };

    return (
        <>
            <Modal title="اسناد مناطق لموظف دعم" opened={opened} onClose={handleClose} centered>
                <div className="relative">
                    <LoadingOverlay zIndex={10000000000} visible={isFetchingLocations} />
                    <MultiSelect
                        value={selectedLocations}
                        label="المناطق"
                        searchable
                        clearable
                        onChange={(e) => {
                            setSelectedLocations(e);
                        }}
                        placeholder="اختر المنطقة"
                        data={getSelectOptions(locationsData?.data || [])}
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
                تغيير المناطق
            </Button>
        </>
    );
};
