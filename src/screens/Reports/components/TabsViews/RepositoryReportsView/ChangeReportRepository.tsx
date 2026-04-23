import { useEditReport } from "@/hooks/useEditReport";
import { useRepositories } from "@/hooks/useRepositories";
import { getSelectOptions } from "@/lib/getSelectOptions";
import { Button, Modal, Select } from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { type Dispatch, useState } from "react";
import toast from "react-hot-toast";

interface Props {
    id: number;
    opened: boolean;
    close: () => void;
    open: () => void;
    setMenuOpen: Dispatch<React.SetStateAction<boolean>>;
}

export const ChangeReportRepository = ({ id, close, open, opened, setMenuOpen }: Props) => {
    const queryClient = useQueryClient();
    const { data: repositoriesData } = useRepositories({
        size: 100000,
        minified: true
    });
    const [selectedRepository, setSelectedRepository] = useState<string | null>(null);

    const { mutate: editReport, isLoading } = useEditReport();

    const handleSubmit = () => {
        if (selectedRepository) {
            editReport(
                {
                    id,
                    repositoryID: Number(selectedRepository)
                },
                {
                    onSuccess: () => {
                        queryClient.invalidateQueries({
                            queryKey: ["orders"]
                        });
                        queryClient.invalidateQueries({
                            queryKey: ["reports"]
                        });
                        toast.success("تم تعديل المخزن بنجاح");
                        close();
                        setMenuOpen(false);
                    }
                }
            );
        }
    };

    return (
        <>
            <Modal title="تعديل المخزن" opened={opened} onClose={close} centered>
                <Select
                    value={selectedRepository}
                    allowDeselect
                    label="المخزن"
                    searchable
                    clearable
                    onChange={(e) => {
                        setSelectedRepository(e);
                    }}
                    placeholder="اختر المخزن"
                    data={getSelectOptions(repositoriesData?.data || [])}
                    limit={100}
                />
                <div className="flex justify-between mt-4 gap-6">
                    <Button
                        loading={false}
                        disabled={!selectedRepository || isLoading}
                        fullWidth
                        onClick={handleSubmit}
                        type="submit"
                    >
                        تحويل
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

            <Button fullWidth size="xs" onClick={open}>
                تحويل الي مخزن
            </Button>
        </>
    );
};
