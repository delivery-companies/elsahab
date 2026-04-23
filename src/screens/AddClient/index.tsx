import { AppLayout } from "@/components/AppLayout";
import { ImageUploader } from "@/components/CustomDropZone";
import { useBranches } from "@/hooks/useBranches";
import { useCreateClient } from "@/hooks/useCreateClient";
import { useTenants } from "@/hooks/useTenants";
import {
  clientTypeArray,
  type clientTypeArabicNames,
} from "@/lib/clientTypeArabicNames";
import { getSelectOptions } from "@/lib/getSelectOptions";
import { useAuth } from "@/store/authStore";
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
import { ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { z } from "zod";
import { addClientSchema } from "./schema";

export const AddClient = () => {
  const navigate = useNavigate();
  const {
    role,
    id: loggedInUserId,
    companyID: loggedInCompanyId,
    branchId,
  } = useAuth();
  const isAdminOrAdminAssistant =
    role === "ADMIN" || role === "ADMIN_ASSISTANT";
  const { data: branches } = useBranches({
    size: 100000,
    minified: true,
  });
  const { data: tenants = { data: [] } } = useTenants({
    size: 100000,
    minified: true,
  });

  const form = useForm({
    validate: zodResolver(addClientSchema),
    initialValues: {
      name: "",
      phone: "",
      branch: "",
      username: "",
      type: "" as (typeof clientTypeArabicNames)["CLIENT"],
      avatar: [] as unknown as FileWithPath[],
      password: "",
      confirmPassword: "",
      companyID: "",
      showNumbers: false,
      showDeliveryNumber: false,
    },
  });

  useEffect(() => {
    if (loggedInUserId) {
      form.setFieldValue("companyID", loggedInCompanyId.toString());
    }
    if (role !== "COMPANY_MANAGER") {
      form.setFieldValue("branch", branchId + "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedInUserId]);

  const { mutate: createClientAction, isLoading } = useCreateClient();

  const handleSubmit = (values: z.infer<typeof addClientSchema>) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("phone", values.phone);
    formData.append("branchID", values.branch);
    formData.append("role", "CLIENT");
    formData.append("password", values.password);
    formData.append("showNumbers", String(values.showNumbers ?? false));
    formData.append(
      "showDeliveryNumber",
      String(values.showDeliveryNumber ?? false),
    );
    if (values.type === "EXTERNAL") {
      formData.append("isExternal", "true");
    }
    formData.append("username", values.phone);
    formData.append("avatar", values?.avatar[0] || "");

    if (isAdminOrAdminAssistant) {
      formData.append("companyID", values.companyID);
    } else {
      formData.append("companyID", loggedInCompanyId.toString());
    }

    createClientAction(formData, {
      onSuccess: () => {
        navigate("/clients");
      },
    });
  };

  return (
    <AppLayout>
      <div className="flex items-center gap-4">
        <ChevronRight
          size={34}
          className="mt-2 cursor-pointer"
          onClick={() => {
            navigate("/clients");
          }}
        />
        <h1 className="text-3xl font-semibold">اضافة عميل</h1>
      </div>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Grid gutter="lg">
          <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
            {role === "COMPANY_MANAGER" ? (
              <Select
                searchable
                label="الفرع"
                placeholder="اختار الفرع"
                data={getSelectOptions(branches?.data || [])}
                limit={100}
                {...form.getInputProps("branch")}
              />
            ) : (
              <Select
                searchable
                disabled
                label="الفرع"
                placeholder="اختار الفرع"
                data={getSelectOptions(branches?.data || [])}
                limit={100}
                {...form.getInputProps("branch")}
              />
            )}
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

            {isAdminOrAdminAssistant && (
              <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                <Select
                  searchable
                  label="الشركة"
                  placeholder="اختار الشركة"
                  data={getSelectOptions(tenants.data || [])}
                  limit={100}
                  {...form.getInputProps("companyID")}
                />
              </Grid.Col>
            )}
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
            <Switch
              label="إظهار رقم العميل للمندوب"
              placeholder="اختار النوع"
              defaultChecked={false}
              {...form.getInputProps("showNumbers")}
              disabled={form.getValues().type === "EXTERNAL"}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
            <Switch
              label="إظهار رقم المندوب للعميل"
              placeholder="اختار النوع"
              defaultChecked={false}
              {...form.getInputProps("showDeliveryNumber")}
              disabled={form.getValues().type === "EXTERNAL"}
            />
          </Grid.Col>
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
              {...form.getInputProps("confirmPassword")}
              disabled={form.getValues().type === "EXTERNAL"}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
            <Button
              loading={isLoading}
              disabled={isLoading}
              type="submit"
              fullWidth
              mt="xl"
              size="md">
              اضافة
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
