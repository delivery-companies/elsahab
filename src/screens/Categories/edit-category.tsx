import type { APIError } from "@/models";
import { editCategoryService } from "@/services/editCategory";
import { Button, Modal, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPencil } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { type FormEvent, useState } from "react";
import toast from "react-hot-toast";

export const EditCategory = ({
    categoryId,
    title
}: {
    categoryId: number;
    title: string;
}) => {
    const [categoryTitle, setCategoryTitle] = useState(title);
    const [opened, { open, close }] = useDisclosure(false);
    const queryClient = useQueryClient();
    const { mutate: editSize, isLoading } = useMutation({
        mutationFn: ({ id, title }: { title: string; id: number }) => editCategoryService({ id, title }),
        onSuccess: () => {
            toast.success("تم تعديل الصنف بنجاح");
            queryClient.invalidateQueries({
                queryKey: ["categories"]
            });
            close();
        },
        onError: (error: AxiosError<APIError>) => {
            toast.error(error.response?.data.message || "حدث خطأ أثناء تعديل الصنف");
        }
    });

    const handleEdit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        editSize({
            id: categoryId,
            title: categoryTitle
        });
    };

    return (
        <>
            <Modal opened={opened} onClose={close} title="تعديل الصنف" centered>
                <form onSubmit={handleEdit}>
                    <TextInput
                        value={categoryTitle}
                        onChange={(event) => setCategoryTitle(event.currentTarget.value)}
                        label="الصنف"
                        required
                        placeholder="الصنف"
                        className="mb-4"
                    />
                    <div className="mt-4 flex items-center gap-4">
                        <Button loading={isLoading} disabled={isLoading || !categoryTitle} variant="filled">
                            تعديل
                        </Button>
                        <Button variant="outline" onClick={close} className="mr-4">
                            إلغاء
                        </Button>
                    </div>
                </form>
            </Modal>

            <IconPencil onClick={open} className="text-yellow-200 cursor-pointer" size={24} />
        </>
    );
};
