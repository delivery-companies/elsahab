import { Card, Text, rem } from "@mantine/core";
import { format, parseISO } from "date-fns";

interface SimpleCardProps {
    title: string;
    createdAt: string;
    cardEditChildren?: React.ReactNode;
    cardDeleteChildren?: React.ReactNode;
    code?: string;
}

export const SimpleCard = ({
    createdAt,
    title,
    cardDeleteChildren,
    cardEditChildren,
    code
}: SimpleCardProps) => {
    return (
        <Card shadow="sm" padding="xl" radius="md" withBorder>
            <div className="flex justify-between">
                <div className="flex flex-col gap-2 ">
                    <div className="flex items-center justify-end gap-3">
                        <Text className="w-10" truncate>
                            {title}
                        </Text>
                        <div
                            className="flex items-center gap-2 rounded-lg"
                            style={{
                                backgroundColor: code,
                                width: rem(30),
                                height: rem(30)
                            }}
                        />
                    </div>
                    <Text>{format(parseISO(createdAt), "yyyy-MM-dd")}</Text>
                </div>
                <div className="flex items-start gap-3">
                    {cardEditChildren}
                    {cardDeleteChildren}
                </div>
            </div>
        </Card>
    );
};

SimpleCard.displayName = "SimpleCard";
