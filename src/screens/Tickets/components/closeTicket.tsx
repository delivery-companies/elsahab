import { useCloseTicket } from "@/hooks/useTicket";
import { Button, Modal, Textarea } from "@mantine/core";
import { useState } from "react";

interface Props {
    id: number;
    opened: boolean;
    close: () => void;
}

export const CloseTicket = ({ id, close, opened }: Props) => {
    const { mutate: closeTicket, isLoading } = useCloseTicket();
    const [content,setContent]=useState('')

    const handleClose = () => {
        close();
    };

    const handleTakeTicket = () => {
        if (!content) {
            return;
        }
        const fm=new FormData()
        fm.append("ticketId",id+"")
        fm.append("content",content)

        closeTicket(fm, {
            onSuccess: () => {
                handleClose();
            }
        });
    };

    return (
        <Modal opened={opened} onClose={handleClose} title="اغلاق التذكره" centered>
           قم بكاتبه ردا علي هذه التذكره
           <div className="mt-4">
             <Textarea
                autosize
                minRows={2}
                maxRows={4}
                onChange={(e)=>{
                    setContent(e.target.value || "")
                }}
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
