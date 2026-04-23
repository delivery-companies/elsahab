import type { APIError } from "@/models";
import { type CreateColorPayload, createColorService } from "@/services/createColor";
import { Button, Modal, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { type FormEvent, useState } from "react";
import { SketchPicker } from "react-color";
import toast from "react-hot-toast";

export const AddColor = () => {
    const [opened, { open, close }] = useDisclosure(false);
    const [colorCode, setColorCode] = useState("");
    const [colorName, setColorName] = useState("");
    const queryClient = useQueryClient();
    const { mutate: addColorAction, isLoading } = useMutation({
        mutationFn: ({ title, code }: CreateColorPayload) => createColorService({ title, code }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["colors"]
            });
            toast.success("تم اضافة اللون بنجاح");
            close();
        },
        onError: (error: AxiosError<APIError>) => {
            toast.error(error.response?.data.message || "حدث خطأ ما");
        }
    });

    const handleDelete = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        addColorAction({ title: colorName, code: colorCode });
    };

    return (
        <>
            <Modal opened={opened} onClose={close} title="اضافة لون" centered>
                <form onSubmit={handleDelete}>
                    <SketchPicker color={colorCode} onChangeComplete={(color) => setColorCode(color.hex)} />
                    <TextInput
                        label="اسم اللون"
                        placeholder="اسم اللون"
                        required
                        variant="filled"
                        className="mb-4"
                        value={colorName}
                        onChange={(e) => setColorName(e.currentTarget.value)}
                    />
                    <div className="mt-4 flex items-center gap-4">
                        <Button
                            type="submit"
                            loading={isLoading}
                            disabled={!colorName || isLoading}
                            variant="filled"
                        >
                            اضافة
                        </Button>
                        <Button variant="outline" onClick={close} className="mr-4">
                            إلغاء
                        </Button>
                    </div>
                </form>
            </Modal>

            <Button rightSection={<IconPlus size={18} />} onClick={open} className="mb-4 md:mb-8">
                اضافة لون جديد
            </Button>
        </>
    );
};
