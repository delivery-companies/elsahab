import { useClients } from "@/hooks/useClients";
import { useEditEmployee } from "@/hooks/useEditEmployee";
import { getSelectOptions } from "@/lib/getSelectOptions";
import { Button, LoadingOverlay, Modal, MultiSelect } from "@mantine/core";
import { useState } from "react";

interface AssignInquiryClientsProps {
    id: number;
    managedClients: string[];
    opened: boolean;
    close: () => void;
    open: () => void;
    closeMenu: () => void;
}

export const AssignInquiryClients = ({
    id,
    managedClients,
    close,
    closeMenu,
    open,
    opened
}: AssignInquiryClientsProps) => {
    const { data: clientsData, isLoading: isFetchingClients } = useClients({
        size: 100000,
        minified: true
    });
    
    const [selectedClients, setSelectedClients] = useState<string[]>(managedClients);

    const { mutate: editEmployeeBranches, isLoading } = useEditEmployee();

    const handleClose = () => {
        close();
        closeMenu();
    };

    const handleSubmit = () => {
        const selectedClientsIDs = selectedClients?.map((client) => Number(client));
        const formData = new FormData();
        formData.append("inquiryClientsIDs", JSON.stringify(selectedClientsIDs));
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
                    setSelectedClients(managedClients);
                }
            }
        );
    };

    return (
        <>
            <Modal title="اسناد عملاء لنتدوب الاستلام" opened={opened} onClose={handleClose} centered>
                <div className="relative">
                    <LoadingOverlay zIndex={10000000000} visible={isFetchingClients} />
                    <MultiSelect
                        value={selectedClients}
                        label="العملاء"
                        searchable
                        clearable
                        onChange={(e) => {
                            setSelectedClients(e);
                        }}
                        placeholder="اختر العميل"
                        data={getSelectOptions(clientsData?.data || [])}
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
                تغيير العملاء
            </Button>
        </>
    );
};
