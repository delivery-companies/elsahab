import { useEditClientAssistantEmployee } from "@/hooks/useEditClientAssistantEmployee";
import { useStores } from "@/hooks/useStores";
import { getSelectOptions } from "@/lib/getSelectOptions";
import { Button, LoadingOverlay, Modal, MultiSelect } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

interface AssignClientAssistantToStoresProps {
    id: number;
    managedStores: string[];
}

export const AssignClientAssistantToStores = ({ id, managedStores }: AssignClientAssistantToStoresProps) => {
    const [opened, { open, close }] = useDisclosure(false);
    const { data: storesData, isLoading: isFetchingStores } = useStores({
        size: 100000,
        minified: true
    });

    const [selectedStores, setSelectedStores] = useState<string[]>(managedStores);

    const { mutate: editClientAssistantStores, isLoading } = useEditClientAssistantEmployee();

    const handleSubmit = () => {
        const selectedStoresIDs = selectedStores?.map((store) => Number(store));
        editClientAssistantStores(
            {
                id,
                data: {
                    storesIDs: selectedStoresIDs || []
                }
            },
            {
                onSuccess: () => {
                    close();
                },
                onError: () => {
                    setSelectedStores(managedStores);
                }
            }
        );
    };

    return (
        <>
            <Modal title="اضافة متاجر لمساعد العميل" opened={opened} onClose={close} centered>
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
                                close();
                            }}
                            fullWidth
                            variant="outline"
                        >
                            الغاء
                        </Button>
                    </div>
                </div>
            </Modal>

            <Button onClick={open}>تغير المتاجر</Button>
        </>
    );
};
