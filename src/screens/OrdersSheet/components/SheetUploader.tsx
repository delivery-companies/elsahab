import { Button, Group, Text, rem, useMantineTheme } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { IconCloudUpload, IconDownload, IconX } from "@tabler/icons-react";
import { useRef } from "react";

interface SheetUploaderProps {
    onDrop: (files: File[]) => void;
    files?: File[];
    onDelete?: () => void;
}

export const SheetUploader = ({ onDrop, files, onDelete }: SheetUploaderProps) => {
    const theme = useMantineTheme();
    const openRef = useRef<() => void>(null);

    return (
        <div className="relative mb-16">
            {!files?.length ? (
                <>
                    <Dropzone
                        openRef={openRef}
                        onDrop={onDrop}
                        className="border-4 pb-12 border-dashed rounded border-gray-700 p-4"
                        maxSize={30 * 1024 ** 2}
                        maxFiles={1}
                    >
                        <div style={{ pointerEvents: "none" }}>
                            <Group justify="center">
                                <Dropzone.Accept>
                                    <IconDownload
                                        style={{ width: rem(50), height: rem(50) }}
                                        color={theme.colors.blue[6]}
                                        stroke={1.5}
                                    />
                                </Dropzone.Accept>
                                <Dropzone.Reject>
                                    <IconX
                                        style={{ width: rem(50), height: rem(50) }}
                                        color={theme.colors.red[6]}
                                        stroke={1.5}
                                    />
                                </Dropzone.Reject>
                                <Dropzone.Idle>
                                    <IconCloudUpload
                                        style={{ width: rem(50), height: rem(50) }}
                                        stroke={1.5}
                                    />
                                </Dropzone.Idle>
                            </Group>

                            <Text ta="center" fw={700} fz="lg" mt="xl">
                                <Dropzone.Accept>رفع ملف الاكسل</Dropzone.Accept>
                                <Dropzone.Reject>
                                    يجب ان يكون الملف بصيغة <i>.csv</i>
                                </Dropzone.Reject>
                                <Dropzone.Idle>رفع ملف الاكسل</Dropzone.Idle>
                            </Text>
                            <Text ta="center" fz="sm" mt="xs" c="dimmed">
                                <Dropzone.Accept>او اسحب وافلت الملف هنا</Dropzone.Accept>
                                <Dropzone.Reject>
                                    يجب ان يكون الملف بصيغة <i>.csv</i>
                                </Dropzone.Reject>
                                <Dropzone.Idle>او اسحب وافلت الملف هنا</Dropzone.Idle>
                            </Text>
                        </div>
                    </Dropzone>

                    <Button
                        className="absolute w-64 -left-[calc(50%-3.5rem)] bottom-5"
                        size="md"
                        radius="xl"
                        onClick={() => openRef.current?.()}
                    >
                        اختر ملف
                    </Button>
                </>
            ) : (
                <div className="border-4 border-dashed rounded border-gray-700 p-4">
                    <div className="flex justify-between">
                        <Text fz="sm" fw={700}>
                            {files?.[0].name}
                        </Text>
                        <Button
                            variant="link"
                            color="red"
                            size="xs"
                            onClick={() => {
                                // onDrop([]);
                                onDelete?.();
                            }}
                        >
                            <IconX />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};
