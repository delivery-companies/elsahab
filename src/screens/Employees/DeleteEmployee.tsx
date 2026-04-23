import type { APIError } from "@/models";
import { deactivateEmployeeService } from "@/services/deactivateEmployee";
import { Button, Modal } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";

interface Props {
    id: number;
    opened: boolean;
    close: () => void;
    open: () => void;
    closeMenu: () => void;
}

export const DeleteEmployee = ({ id, close, closeMenu, open, opened }: Props) => {
    const queryClient = useQueryClient();

    const handleClose = () => {
        close();
        closeMenu();
    };

    const { mutate: deleteEmployee, isLoading } = useMutation({
        mutationFn: (id: number) => deactivateEmployeeService({ id }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["employees"]
            });
            toast.success("تم اضافة الموظف لقائمة المحذوفات");
            handleClose();
        },
        onError: (error: AxiosError<APIError>) => {
            toast.error(error.response?.data.message || "حدث خطأ ما");
        }
    });

    const handleDelete = () => {
        deleteEmployee(id);
    };

    return (
        <>
            <Modal opened={opened} onClose={handleClose} title="مسح الموظف" centered>
                هل انت متأكد من مسح الموظف؟
                <div className="mt-4 flex items-center gap-4">
                    <Button loading={isLoading} disabled={isLoading} variant="filled" onClick={handleDelete}>
                        مسح
                    </Button>
                    <Button variant="outline" onClick={handleClose} className="mr-4">
                        إلغاء
                    </Button>
                </div>
            </Modal>

            <Button fullWidth variant="filled" onClick={open}>
                مسح
            </Button>
        </>
    );
};
