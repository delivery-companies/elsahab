import ErrorImage from "@/assets/error-image.svg";
import { Button, Container, Image, SimpleGrid, Text, Title, rem } from "@mantine/core";

export const ErrorScreen = () => {
    return (
        <Container className="pt-20 pb-20">
            <SimpleGrid
                spacing={{ base: 40, sm: 80 }}
                cols={{ base: 1, sm: 2 }}
                className="grid-cols-1 sm:grid-cols-2"
            >
                <div className="hidden sm:block">
                    <Image src={ErrorImage} className="w-full" />
                </div>
                <div>
                    <Title mb={rem(10)} className="font-extrabold text-2xl mb-4 font-GreycliffCF">
                        هناك شيء خاطئ...
                    </Title>
                    <Text mb={rem(10)} className="text-dimmed text-lg">
                        الصفحة التي تحاول فتحها غير موجودة. قد تكون قد أدخلت عنوانًا خاطئًا، أو تم نقل الصفحة
                        إلى عنوان URL آخر. إذا كنت تعتقد أن هذا خطأ، يرجى الاتصال بالدعم الفني.
                    </Text>
                    <Button
                        onClick={() => {
                            window.location.href = "/";
                        }}
                        variant="outline"
                        size="md"
                        className="w-full sm:w-auto mt-6"
                    >
                        العودة إلى الصفحة الرئيسية
                    </Button>
                </div>
                <div className="sm:hidden">
                    <Image src={ErrorImage} className="w-full" />
                </div>
            </SimpleGrid>
        </Container>
    );
};
