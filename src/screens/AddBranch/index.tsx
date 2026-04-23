import { AppLayout } from "@/components/AppLayout";
import { governorateArray } from "@/lib/governorateArabicNames ";
import type { APIError } from "@/models";
import {
  type CreateBranchPayload,
  createBranchService,
} from "@/services/createBranchService";
import { Autocomplete, Button, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import type { z } from "zod";
import { addBranchSchema } from "./schema";

export const AddBranch = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate: createBranch, isLoading } = useMutation({
    mutationFn: ({ governorate, name }: CreateBranchPayload) => {
      return createBranchService({
        governorate,
        name,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["branches"],
      });
      toast.success("تم اضافة الفرع بنجاح");
      navigate("/branches");
    },
    onError: (error: AxiosError<APIError>) => {
      toast.error(error.response?.data.message || "حدث خطأ ما");
    },
  });

  const form = useForm({
    validate: zodResolver(addBranchSchema),
    initialValues: {
      location: "",
      name: "",
      branchOrder: 0,
      branchClient: 0,
    },
  });

  const handleSubmit = (values: z.infer<typeof addBranchSchema>) => {
    const enLocation = governorateArray.find(
      (governorate) => governorate.label === values.location
    );
    if (!enLocation) {
      form.setFieldError("location", "الرجاء اختيار الفرع");
      return;
    }
    createBranch({
      governorate: enLocation.value,
      name: values.name,
    });
  };
  return (
    <AppLayout>
      <div className="flex items-center gap-4">
        <ChevronRight
          size={34}
          className="mt-2 cursor-pointer"
          onClick={() => {
            navigate("/branches");
          }}
        />
        <h1 className="text-3xl font-semibold">اضافة فرع</h1>
      </div>
      <form
        onSubmit={form.onSubmit(handleSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
        <TextInput
          label="الاسم"
          placeholder=""
          size="md"
          className="w-full"
          {...form.getInputProps("name")}
        />
        <Autocomplete
          label="المحافظة"
          placeholder="اختار المحافظة"
          data={governorateArray}
          {...form.getInputProps("location")}
        />
        <Button
          loading={isLoading}
          disabled={isLoading}
          type="submit"
          fullWidth
          mt="xl"
          size="md">
          اضافة
        </Button>
        <Button
          type="reset"
          fullWidth
          mt="xl"
          size="md"
          variant="outline"
          onClick={() => {
            form.reset();
            navigate("/branches");
          }}>
          الغاء
        </Button>
      </form>
    </AppLayout>
  );
};
