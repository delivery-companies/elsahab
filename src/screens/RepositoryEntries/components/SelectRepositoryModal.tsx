import { useChangeOrderStatus } from "@/hooks/useChangeOrderStatus";
import { useRepositories } from "@/hooks/useRepositories";
import { getSelectOptions } from "@/lib/getSelectOptions";
import { Button, Menu, Modal, Select } from "@mantine/core";
import { useState } from "react";
import toast from "react-hot-toast";

interface Props {
    id: string;
    opened: boolean;
    close: () => void;
    open: () => void;
}

export const SelectRepositoryModal = ({ close, id, open, opened }: Props) => {
    const { data: repositoriesData } = useRepositories({
        size: 100000,
        minified: true
    });
    const [selectedRepository, setSelectedRepository] = useState<string | null>(null);

    const { mutate: changeStatus, isLoading } = useChangeOrderStatus();

    const handleSubmit = () => {
        if (selectedRepository) {
            changeStatus(
                {
                    id,
                    data: {
                        repositoryID: Number(selectedRepository),
                        status: "RETURNED",
                        secondaryStatus: "IN_REPOSITORY"
                    }
                },
                {
                    onSuccess: () => {
                        close();
                        toast.success("تم تعديل حالة الطلب بنجاح");
                    }
                }
            );
        }
    };

    return (
        <>
            <Modal title="تعديل حالة الطلب" opened={opened} onClose={close} centered>
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

            <Menu.Item closeMenuOnClick={false} onClick={open}>
                ارجاع الطلب الي مخزن المحافظة
            </Menu.Item>
        </>
    );
};
