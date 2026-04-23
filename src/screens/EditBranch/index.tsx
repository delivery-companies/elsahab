import { AppLayout } from "@/components/AppLayout";
import { useBranchDetails } from "@/hooks/useBranchDetails";
import { governorateArray } from "@/lib/governorateArabicNames ";
import {
  type EditBranchPayload,
  editBranchService,
} from "@/services/editBranchService";
import { Autocomplete, Button, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import type { z } from "zod";
import { editBranchSchema } from "./schema";

export const EditBranch = () => {
  const navigate = useNavigate();
  const { id = "" } = useParams();
  const {
    data: branchDetails,
    isLoading,
    isError,
  } = useBranchDetails(Number.parseInt(id));
  const queryClient = useQueryClient();
  const { mutate: editBranch, isLoading: isEditing } = useMutation({
    mutationFn: ({ governorate, name }: EditBranchPayload) =>
      editBranchService({
        data: {
          governorate,
          name,
        },
        id: Number.parseInt(id),
      }),
    onSuccess: () => {
      toast.success("تم تعديل الفرع بنجاح");
      navigate("/branches");
      queryClient.invalidateQueries({
        queryKey: ["branches"],
      });
    },
  });

  const form = useForm({
    validate: zodResolver(editBranchSchema),
    initialValues: {
      location: "",
      name: "",
      branchOrder: 0,
      branchClient: 0,
    },
  });

  useEffect(() => {
    const transformedLocation = governorateArray.find(
      (item) => item.value === branchDetails?.data?.governorate,
    );
    form.setValues({
      name: branchDetails?.data?.name,
      location: transformedLocation?.label,
      branchClient: branchDetails?.data.branchCLient,
      branchOrder: branchDetails?.data.branchOrder,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchDetails?.data?.governorate, branchDetails?.data?.name]);

  const handleSubmit = (values: z.infer<typeof editBranchSchema>) => {
    const enBranch = governorateArray.find(
      (item) => item.label === values.location,
    );
    if (!enBranch) {
      form.setFieldError("location", "الرجاء اختيار الفرع");
      return;
    }
    editBranch({
      governorate: enBranch.value,
      name: values.name,
    });
  };

  return (
    <AppLayout isLoading={isLoading} isError={isError}>
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
          label="المحافظه"
          placeholder="اختار المحافظه"
          data={governorateArray}
          {...form.getInputProps("location")}
        />
        <Button
          loading={isEditing}
          disabled={isEditing}
          type="submit"
          fullWidth
          mt="xl"
          size="md">
          تعديل
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
