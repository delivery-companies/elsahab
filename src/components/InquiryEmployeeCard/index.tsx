import type { OrderInquiryEmployee } from "@/services/getOrders";
import { ActionIcon, Fieldset, Text } from "@mantine/core";
import { XIcon } from "lucide-react";

interface UserInfoIconsProps extends Partial<OrderInquiryEmployee> {
    onclick?: () => void;
}

export const UserInfoIcons = ({ name, onclick = () => {} }: UserInfoIconsProps) => {
    return (
        <Fieldset
            className="w-full"
            legend={
                <ActionIcon onClick={onclick}>
                    <XIcon size={20} />
                </ActionIcon>
            }
        >
            <Text fz="lg" fw={500}>
                {name}
            </Text>
        </Fieldset>
    );
};
