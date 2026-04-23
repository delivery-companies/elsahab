import type { APIError } from "@/models";
import { editColorService } from "@/services/editColor";
import { ActionIcon, Button, Modal, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPencil } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { type FormEvent, useState } from "react";
import { SketchPicker } from "react-color";
import toast from "react-hot-toast";

export const EditColor = ({
    colorId,
    title,
    code
}: {
    colorId: number;
    title: string;
    code: string;
}) => {
    const [colorCode, setColorCode] = useState(code);
    const [colorName, setColorName] = useState(title);
    const [opened, { open, close }] = useDisclosure(false);
    const queryClient = useQueryClient();
    const { mutate: editColor, isLoading } = useMutation({
        mutationFn: ({
            id,
            title,
            code
        }: {
            title: string;
            id: number;
            code: string;
        }) => editColorService({ id, title, code }),
        onSuccess: () => {
            toast.success("تم تعديل اللون بنجاح");
            queryClient.invalidateQueries({
                queryKey: ["colors"]
            });
            close();
        },
        onError: (error: AxiosError<APIError>) => {
            toast.error(error.response?.data.message || "حدث خطأ أثناء تعديل اللون");
        }
    });

    const handleEdit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        editColor({ title: colorName, id: colorId, code: colorCode });
    };

    const isDirty = colorName !== title || colorCode !== code;

    return (
        <>
            <Modal opened={opened} onClose={close} title="تعديل اللون" centered>
                <form onSubmit={handleEdit}>
                    <SketchPicker color={colorCode} onChangeComplete={(color) => setColorCode(color.hex)} />
                    <TextInput
                        value={colorName}
                        onChange={(event) => setColorName(event.currentTarget.value)}
                        label="اللون"
                        required
                        placeholder="اللون"
                        className="mb-4"
                    />
                    <div className="mt-4 flex items-center gap-4">
                        <Button
                            loading={isLoading}
                            disabled={isLoading || !colorName || !isDirty}
                            type="submit"
                            variant="filled"
                        >
                            تعديل
                        </Button>
                        <Button variant="outline" onClick={close} className="mr-4">
                            إلغاء
                        </Button>
                    </div>
                </form>
            </Modal>

            <ActionIcon size="lg" color="yellow" onClick={open}>
                <IconPencil className="text-white" />
            </ActionIcon>
        </>
    );
};
