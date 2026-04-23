import { useEditStore } from "@/hooks/useEditStore";
import { useEmployees } from "@/hooks/useEmployees";
import { getSelectOptions } from "@/lib/getSelectOptions";
import { Button, LoadingOverlay, Modal, Select } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

interface ChangeStoreClientAssistantProps {
    id: number;
    clientAssistant: { id: number; name: string } | null;
}

export const ChangeStoreClientAssistant = ({ id, clientAssistant }: ChangeStoreClientAssistantProps) => {
    const [opened, { open, close }] = useDisclosure(false);
    const { data: clientAssistantData, isLoading: isFetchingEmployees } = useEmployees({
        size: 100000,
        minified: true,
        roles: ["CLIENT_ASSISTANT"]
    });
    const [selectedClientAssistant, setSelectedClientAssistant] = useState<string | null>(
        clientAssistant?.id.toString() || ""
    );

    const { mutate: editStoreClientAssistant, isLoading } = useEditStore();

    const handleSubmit = () => {
        editStoreClientAssistant(
            {
                id,
                data: {
                    clientAssistantID: Number(selectedClientAssistant)
                }
            },
            {
                onSuccess: () => {
                    close();
                },
                onError: () => {
                    setSelectedClientAssistant(clientAssistant?.id.toString() || "");
                }
            }
        );
    };

    return (
        <>
            <Modal title="تغير مساعد العميل" opened={opened} onClose={close} centered>
                <div className="relative">
                    <LoadingOverlay zIndex={10000000000} visible={isFetchingEmployees} />
                    <Select
                        value={selectedClientAssistant}
                        label="تغيير مساعد العميل"
                        searchable
                        clearable
                        onChange={(e) => {
                            setSelectedClientAssistant(e);
                        }}
                        placeholder="اختر مساعد العميل"
                        data={getSelectOptions(clientAssistantData?.data || [])}
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

            <Button variant="outline" onClick={open}>
                {clientAssistant?.name || "تعيين مساعد العميل"}
            </Button>
        </>
    );
};
