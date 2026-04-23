import { useDepartments } from "@/hooks/useDepartments";
import {  useForwardTicket } from "@/hooks/useTicket";
import { Button, Modal, Select } from "@mantine/core";
import { useState } from "react";

interface Props {
    id: number;
    opened: boolean;
    close: () => void;
}

export const ForwardTicket = ({ id, close, opened }: Props) => {
    const { mutate: forwardTicket, isLoading } = useForwardTicket();
    const [department,setDepartment]=useState('')

        const {
            data: departments = {
                data: [],
            },
        } = useDepartments({page:1,size:100000});

    const handleClose = () => {
        close();
    };

    const handleTakeTicket = () => {
        if (department === '') {
            return;
        }
        const fm=new FormData()
        fm.append("ticketId",id+"")
        fm.append("departmentId",department)

        forwardTicket(fm, {
            onSuccess: () => {
                handleClose();
            }
        });
    };

    return (
        <Modal opened={opened} onClose={handleClose} title="تحويل التذكره" centered>
           قم بتحويل التكره الى احد الاقسام
           <div className="mt-4">
             <Select
                value={department}
                allowDeselect
                label="القسم"
                searchable
                clearable
                onChange={(e) => {
                    setDepartment(e || "");
                }}
                placeholder="اختر القسم"
                data={departments.data.map(d => ({label:d.name,value:d.id+""}))}
                limit={100}
            />
           </div>
            <div className="mt-4 flex items-center gap-2">
                <Button loading={isLoading} disabled={isLoading} variant="outline" onClick={handleTakeTicket}>
                    تأكيد
                </Button>
                <Button variant="default" onClick={handleClose} className="mr-4">
                    إلغاء
                </Button>
            </div>
        </Modal>
    );
};
