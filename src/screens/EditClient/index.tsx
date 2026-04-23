import { AppLayout } from "@/components/AppLayout";
import { ImageUploader } from "@/components/CustomDropZone";
import { useBranches } from "@/hooks/useBranches";
import { useClientDetails } from "@/hooks/useClientDetails";
import { clientTypeArray } from "@/lib/clientTypeArabicNames";
import { getSelectOptions } from "@/lib/getSelectOptions";
import type { APIError } from "@/models";
import { editClientService } from "@/services/editClient";
import {
  Button,
  Grid,
  PasswordInput,
  Select,
  Switch,
  TextInput,
} from "@mantine/core";
import type { FileWithPath } from "@mantine/dropzone";
import { useForm, zodResolver } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { ChevronRight } from "lucide-react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import type { z } from "zod";
import { editClientSchema } from "./schema";

export const EditClient = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: branches } = useBranches({
    size: 100000,
    minified: true,
  });
  const {
    data: clientDetails,
    isLoading,
    isError,
  } = useClientDetails(Number.parseInt(id));

  const form = useForm({
    validate: zodResolver(editClientSchema),
    initialValues: {
      name: "",
      phone: "",
      branch: "",
      type: "",
      password: "",
      confirmPassword: "",
      avatar: [] as unknown as FileWithPath[],
      companyID: "",
      showNumbers: false,
      showDeliveryNumber: false,
    },
  });

  useEffect(() => {
    if (clientDetails) {
      const avatarAddress = clientDetails.data.avatar;
      form.setValues({
        name: clientDetails.data.name,
        phone: clientDetails.data.phone,
        branch: clientDetails.data.branch?.id.toString(),
        showNumbers: clientDetails.data.showNumbers,
        showDeliveryNumber: clientDetails.data.showDeliveryNumber,
        type: clientDetails.data.isExternal
          ? "EXTERNAL"
          : clientDetails.data.role,
        companyID: clientDetails.data.company?.id.toString(),
        avatar: [avatarAddress] as unknown as FileWithPath[],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientDetails]);

  const { mutate: editClientAction, isLoading: isEditing } = useMutation({
    mutationFn: (data: FormData) => {
      return editClientService({ id: Number.parseInt(id), data });
    },
    onSuccess: () => {
      toast.success("تم تعديل العميل بنجاح");
      navigate("/clients");
      queryClient.invalidateQueries({
        queryKey: ["clients"],
      });
    },
    onError: (error: AxiosError<APIError>) => {
      toast.error(error.response?.data.message || "حدث خطأ ما");
    },
  });

  const handleSubmit = (values: z.infer<typeof editClientSchema>) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("phone", values.phone);
    formData.append("username", values.phone);
    formData.append("branchID", values.branch);
    formData.append("showNumbers", String(values.showNumbers ?? false));

    formData.append(
      "showDeliveryNumber",
      String(values.showDeliveryNumber ?? false),
    );
    // formData.append("accountType", values.type);
    if (values.type === "EXTERNAL") {
      formData.append("isExternal", "true");
    } else {
      formData.append("isExternal", "false");
    }

    if (values.password) {
      formData.append("password", values.password);
    }

    formData.append("avatar", values?.avatar[0] || "");
    formData.append("token", "");
    formData.append("companyID", values.companyID);

    editClientAction(formData);
  };

  return (
    <AppLayout isLoading={isLoading} isError={isError}>
      <div className="flex items-center gap-4">
        <ChevronRight
          size={34}
          className="mt-2 cursor-pointer"
          onClick={() => {
            navigate("/clients");
          }}
        />
        <h1 className="text-3xl font-semibold">تعديل عميل</h1>
      </div>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
            <Select
              searchable
              label="الفرع"
              placeholder="اختار الفرع"
              data={getSelectOptions(branches?.data || [])}
              limit={100}
              {...form.getInputProps("branch")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
            <TextInput
              label="الاسم"
              placeholder=""
              size="md"
              className="w-full"
              {...form.getInputProps("name")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
            <Select
              searchable
              label="نوع الحساب"
              placeholder="اختار النوع"
              data={clientTypeArray}
              {...form.getInputProps("type")}
              value={"CLIENT"}
              disabled
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
            <TextInput
              label="رقم الهاتف"
              placeholder=""
              size="md"
              className="w-full"
              {...form.getInputProps("phone")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
            <Switch
              label="إظهار رقم العميل للمندوب"
              placeholder="اختار النوع"
              defaultChecked={clientDetails?.data.showNumbers}
              {...form.getInputProps("showNumbers")}
              disabled={form.getValues().type === "EXTERNAL"}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
            <Switch
              label="إظهار رقم المندوب للعميل"
              placeholder="اختار النوع"
              defaultChecked={clientDetails?.data.showDeliveryNumber}
              {...form.getInputProps("showDeliveryNumber")}
              disabled={form.getValues().type === "EXTERNAL"}
            />
          </Grid.Col>
          {/* {isAdminOrAdminAssistant && (
            <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
              <Select
                searchable
                label="الشركة"
                placeholder="اختار الشركة"
                data={transformedTenants}
                limit={100}
                {...form.getInputProps('companyID')}
              />
            </Grid.Col>
          )} */}
          <Grid.Col span={{ base: 12, md: 12, lg: 12, sm: 12, xs: 12 }}>
            <ImageUploader
              image={form.values.avatar}
              onDrop={(files) => {
                form.setFieldValue("avatar", files);
              }}
              onDelete={() => {
                form.setFieldValue("avatar", []);
              }}
              error={!!form.errors.avatar}
            />
            {form.errors.avatar && (
              <div className="text-red-500">{form.errors.avatar}</div>
            )}
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
            <PasswordInput
              label="كلمة المرور"
              placeholder="*******"
              mt="md"
              size="md"
              className="w-full"
              {...form.getInputProps("password")}
              disabled={form.getValues().type === "EXTERNAL"}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
            <PasswordInput
              label="تأكيد كلمة المرور"
              placeholder="*******"
              mt="md"
              size="md"
              className="w-full"
              disabled={form.getValues().type === "EXTERNAL"}
              {...form.getInputProps("confirmPassword")}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
            <Button
              loading={isEditing}
              disabled={isEditing}
              type="submit"
              fullWidth
              mt="xl"
              size="md">
              تعديل
            </Button>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
            <Button
              type="reset"
              fullWidth
              mt="xl"
              size="md"
              variant="outline"
              onClick={() => {
                form.reset();
                navigate("/clients");
              }}>
              الغاء
            </Button>
          </Grid.Col>
        </Grid>
      </form>
    </AppLayout>
  );
};
