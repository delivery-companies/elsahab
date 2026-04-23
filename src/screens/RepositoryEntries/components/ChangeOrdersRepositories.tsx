import { useChangeOrderStatus } from "@/hooks/useChangeOrderStatus";
import { useRepositories } from "@/hooks/useRepositories";
import { getSelectOptions } from "@/lib/getSelectOptions";
import { useRepositoryOrdersStore } from "@/store/repositoryEntriesOrders";
import { Button, Modal, Select } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";

export const ChangeOrdersRepositories = () => {
    const queryClient = useQueryClient();
    const [opened, { open, close }] = useDisclosure(false);
    const { repositoryOrders, deleteAllRepositoryOrders } = useRepositoryOrdersStore();
    const { data: repositoriesData } = useRepositories({
        size: 100000,
        minified: true
    });
    const [selectedRepository, setSelectedRepository] = useState<string | null>(null);

    const { mutate: changeStatus, isLoading } = useChangeOrderStatus();

    const handleSubmit = () => {
        if (selectedRepository) {
            repositoryOrders.forEach((order) => {
                changeStatus(
                    {
                        id: order.id,
                        data: {
                            repositoryID: Number(selectedRepository),
                            secondaryStatus: "IN_REPOSITORY"
                        }
                    },
                    {
                        onSuccess: () => {
                            queryClient.invalidateQueries({
                                queryKey: ["orders"]
                            });
                            toast.success("تم تعديل الطلب بنجاح");
                            deleteAllRepositoryOrders();
                            close();
                        }
                    }
                );
            });
        }
    };

    return (
        <>
            <Modal title="ادخال الطلبات المحددة للمخزن" opened={opened} onClose={close} centered>
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

            <Button disabled={!repositoryOrders.length} onClick={open}>
                ادخال المحدد للمخزن
            </Button>
        </>
    );
};
