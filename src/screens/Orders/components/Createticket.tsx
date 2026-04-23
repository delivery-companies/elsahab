import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateTicket } from "@/hooks/useTicket";
import { Button, Modal, Textarea } from "@mantine/core";
import { useState } from "react";

interface Props {
    id: string;
    opened: boolean;
    close: () => void;
    open: () => void;
    closeMenu: () => void;
}

export const CreateTicket = ({ id, close, open, opened, closeMenu }: Props) => {
    const { mutate: createTicket, isLoading } = useCreateTicket();
    const [content,setContent]=useState('')

    const handleClose = () => {
        close();
        closeMenu();
    };

    const handleCreateTicket = () => {
        if (!content) {
            return;
        }
        const fm=new FormData()
        fm.append("orderId",id)
        fm.append("content",content)
        createTicket(
            fm,
            {
                onSuccess: () => {
                    handleClose();
                }
            }
        );
    };
    
    return (
        <>
            <Modal opened={opened} onClose={handleClose} title="إنشاء تذكره" centered>
                <Card>
                    <CardHeader>
                        <CardTitle>إنشاء تذكره</CardTitle>
                        <CardDescription>قم بوصف مشكله الطلب</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <Textarea
                            autosize
                            minRows={2}
                            maxRows={4}
                            label="ما المشكله"
                            onChange={(e)=>{
                                setContent(e.target.value || "")
                            }}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button
                            loading={isLoading}
                            disabled={isLoading}
                            variant="outline"
                            className="w-full"
                            onClick={handleCreateTicket}
                        >
                            إنشاء تذكره
                        </Button>
                    </CardFooter>
                </Card>
            </Modal>

            <Button className="mb-2" fullWidth variant="outline" onClick={open}>
                إنشاء تذكره
            </Button>
        </>
    );
};
