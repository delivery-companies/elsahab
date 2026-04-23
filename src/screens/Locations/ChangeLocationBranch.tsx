import { useBranches } from "@/hooks/useBranches";
import { getSelectOptions } from "@/lib/getSelectOptions";
import type { APIError } from "@/models";
import { editLocationBranchesService, type EditLocationPayload } from "@/services/editLocation";
import { useLocationsStore } from "@/store/locationsStore";
import { Button, Modal, Select } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

export const ChangeLocationBranch = () => {
    const queryClient = useQueryClient();
    const { locations: selectedLocations } = useLocationsStore();
    const [opened, { open, close }] = useDisclosure(false);
    const { data: branches } = useBranches({
        size: 100000,
        minified: true
    });
    const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

    const { mutate: editLocationAction, isLoading: isEditing } = useMutation({
        mutationFn: (data: { id: number; data: EditLocationPayload }) => {
            return editLocationBranchesService({ id: Number(data.id), data: data.data });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["locations"]
            });
            close();
        },
        onError: (error: AxiosError<APIError>) => {
            toast.error(error.response?.data.message || "حدث خطأ ما");
        }
    });

    const handleSubmit = () => {
        if (selectedBranch) {
            // biome-ignore lint/complexity/noForEach: <explanation>
            selectedLocations.forEach((location) => {
                editLocationAction({
                    id: Number(location.id),
                    data: {
                        branchID: Number(selectedBranch)
                    }
                });
            });
            toast.success("تم تعديل المناطق بنجاح");
        }
    };

    return (
        <>
            <Modal title="تغيير  الفرع" opened={opened} onClose={close} centered>
                <Select
                    value={selectedBranch}
                    allowDeselect
                    label="الفرع"
                    searchable
                    clearable
                    onChange={(e) => {
                        setSelectedBranch(e);
                    }}
                    placeholder="اختر الفرع"
                    data={getSelectOptions(branches?.data || [])}
                    limit={100}
                />
                <div className="flex justify-between mt-4 gap-6">
                    <Button
                        loading={false}
                        disabled={!selectedBranch || isEditing}
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
            </Modal>

            <Button disabled={!selectedLocations.length} loading={isEditing} onClick={open}>
                احالة المناطق الي فرع
            </Button>
        </>
    );
};
