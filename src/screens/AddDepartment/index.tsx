import { AppLayout } from "@/components/AppLayout";
import { useCreateDepartment } from "@/hooks/useDepartments";
import { Button, Grid, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const createProductSchema = z.object({
    name: z.string().min(2, { message: "يجب ان يكون اسم القسم اكثر من 2 احرف" }),
});

export const AddDepartment = () => {
    const navigate = useNavigate();
    const form = useForm({
        validate: zodResolver(createProductSchema),
        initialValues: {
            name: "",
        }
    });

    const { mutate: createDepartmentAction, isLoading } = useCreateDepartment();

    const handleSubmit = (values: z.infer<typeof createProductSchema>) => {
        const formData = new FormData();
        formData.append("name", values.name);
        createDepartmentAction(formData);
    };

    return (
        <AppLayout>
            <div className="flex items-center gap-4 mb-6">
                <ChevronRight
                    size={34}
                    className="mt-2 cursor-pointer"
                    onClick={() => {
                        navigate("/departments");
                    }}
                />
                <h1 className="text-3xl font-semibold">اضافة قسم جديد</h1>
            </div>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Grid gutter="md">
                    <Grid.Col span={{ base: 12, md: 12, lg: 12, sm: 12, xs: 12 }}>
                        <TextInput label="اسم القسم" {...form.getInputProps("name")} />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                        <Button disabled={isLoading} loading={isLoading} fullWidth type="submit">
                            اضافة
                        </Button>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                        <Button
                            onClick={() => {
                                navigate("/departments");
                            }}
                            fullWidth
                            variant="outline"
                        >
                            العودة
                        </Button>
                    </Grid.Col>
                </Grid>
            </form>
        </AppLayout>
    );
};
