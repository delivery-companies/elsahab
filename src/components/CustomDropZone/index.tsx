import { cn } from "@/lib/utils";
import { Group, Image, Text, rem } from "@mantine/core";
import { Dropzone, type DropzoneProps, type FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import { Trash2 } from "lucide-react";

interface ImageUploaderProps extends DropzoneProps {
    image?: FileWithPath[];
    onDelete: () => void;
    error?: boolean;
}

export const ImageUploader = ({ image, onDelete, error, ...props }: ImageUploaderProps) => {
    const renderedFiles = image || [];
    const previews = renderedFiles.map((file) => {
        const imageUrl = typeof file === "string" ? file : URL.createObjectURL(file);
        return (
            <div key={file.path || file.toString()} className="relative">
                <Trash2
                    color="red"
                    className="absolute top-0 right-0 cursor-pointer"
                    onClick={() => {
                        onDelete();
                    }}
                    size={33}
                />
                <Image
                    h={200}
                    radius="md"
                    fit="contain"
                    src={imageUrl}
                    onLoad={() => URL.revokeObjectURL(imageUrl)}
                />
            </div>
        );
    });

    return (
        <div>
            {renderedFiles.length > 0 && !renderedFiles[0]?.toString()?.endsWith(".app") ? (
                <div>{previews}</div>
            ) : (
                <Dropzone
                    {...props}
                    maxSize={3 * 1024 ** 2}
                    accept={IMAGE_MIME_TYPE}
                    maxFiles={1}
                    className={cn(
                        "border-2 border-dashed border-gray-300 rounded-md p-3",
                        error && "border-red-500"
                    )}
                >
                    <Group justify="center" gap="xl" mih={200} style={{ pointerEvents: "none" }}>
                        <Dropzone.Accept>
                            <IconUpload
                                style={{
                                    width: rem(52),
                                    height: rem(52),
                                    color: "var(--mantine-color-blue-6)"
                                }}
                                stroke={1.5}
                            />
                        </Dropzone.Accept>
                        <Dropzone.Reject>
                            <IconX
                                style={{
                                    width: rem(52),
                                    height: rem(52),
                                    color: "var(--mantine-color-red-6)"
                                }}
                                stroke={1.5}
                            />
                        </Dropzone.Reject>
                        <Dropzone.Idle>
                            <IconPhoto
                                style={{
                                    width: rem(52),
                                    height: rem(52),
                                    color: "var(--mantine-color-dimmed)"
                                }}
                                stroke={1.5}
                            />
                        </Dropzone.Idle>

                        <div>
                            <Text ta="center" size="xl" inline>
                                اسحب الصور هنا او اضغط لاختيار الصور
                            </Text>
                            <Text ta="center" size="sm" c="dimmed" inline mt={7}>
                                ارفق ملفات بأي صيغة تريدها، كل ملف لا يجب ان يتجاوز 5 ميغابايت
                            </Text>
                        </div>
                    </Group>
                </Dropzone>
            )}
        </div>
    );
};
