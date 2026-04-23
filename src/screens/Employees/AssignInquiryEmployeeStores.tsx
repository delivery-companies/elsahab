import { useEditEmployee } from "@/hooks/useEditEmployee";
import { useStores } from "@/hooks/useStores";
import { getSelectOptions } from "@/lib/getSelectOptions";
import { Button, LoadingOverlay, Modal, MultiSelect } from "@mantine/core";
import { useState } from "react";

interface AssignInquiryEmployeeToStoresProps {
    id: number;
    managedStores: string[];
    opened: boolean;
    close: () => void;
    open: () => void;
    closeMenu: () => void;
}

export const AssignInquiryEmployeeStores = ({
    id,
    managedStores,
    close,
    closeMenu,
    open,
    opened
}: AssignInquiryEmployeeToStoresProps) => {
    const { data: storesData, isLoading: isFetchingStores } = useStores({
        size: 100000,
        minified: true
    });

    const [selectedStores, setSelectedStores] = useState<string[]>(managedStores);

    const { mutate: editEmployeeStores, isLoading } = useEditEmployee();

    const handleClose = () => {
        close();
        closeMenu();
    };

    const handleSubmit = () => {
        const selectedStoresIDs = selectedStores?.map((store) => Number(store));
        const formData = new FormData();
        formData.append("inquiryStoresIDs", JSON.stringify(selectedStoresIDs));
        editEmployeeStores(
            {
                id,
                data: formData
            },
            {
                onSuccess: () => {
                    handleClose();
                },
                onError: () => {
                    setSelectedStores(managedStores);
                }
            }
        );
    };

    return (
        <>
            <Modal title="اضافة متاجر لمساعد العميل" opened={opened} onClose={handleClose} centered>
                <div className="relative">
                    <LoadingOverlay zIndex={10000000000} visible={isFetchingStores} />
                    <MultiSelect
                        value={selectedStores}
                        label="المتاجر"
                        searchable
                        clearable
                        onChange={(e) => {
                            setSelectedStores(e);
                        }}
                        placeholder="اختر المتجر"
                        data={getSelectOptions(storesData?.data || [])}
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
                تغير المتاجر
            </Button>
        </>
    );
};
