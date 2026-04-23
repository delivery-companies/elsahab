import { AppLayout } from "@/components/AppLayout";
import { ImageUploader } from "@/components/CustomDropZone";
import { useBranches } from "@/hooks/useBranches";
import { useEmployeeDetails } from "@/hooks/useEmployeeDetails";
import { useRepositories } from "@/hooks/useRepositories";
import {
  clientAssistantPermissionsArray,
  permissionsArray,
} from "@/lib/persmissionArabicNames";
import { rolesArray } from "@/lib/rolesArabicNames";
import type { APIError } from "@/models";
import { editEmployeeService } from "@/services/editEmployee";
import { useAuth } from "@/store/authStore";
import {
  Button,
  Grid,
  MultiSelect,
  PasswordInput,
  Select,
  TextInput,
} from "@mantine/core";
import type { FileWithPath } from "@mantine/dropzone";
import { useForm, zodResolver } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import type { z } from "zod";
import { editClientAssistantSchema, editEmployeeSchema } from "./schema";
import { orderStatusArray } from "@/lib/orderStatusArabicNames";
import { useStores } from "@/hooks/useStores";
import { getSelectOptions } from "@/lib/getSelectOptions";
import { useLocations } from "@/hooks/useLocations";
import { governorateArray } from "@/lib/governorateArabicNames ";
import { useEmployees } from "@/hooks/useEmployees";

export const EditEmployee = () => {
  const { id = "" } = useParams();
  const { role, companyID: loggedInCompanyId } = useAuth();
  const isAdminOrAdminAssistant =
    role === "ADMIN" || role === "ADMIN_ASSISTANT";
  const isBranchManager = role === "BRANCH_MANAGER";
  const navigate = useNavigate();
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedGovernorate, setSelectedGovernorate] = useState<string[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [orderType, setOrdertype] = useState<string | undefined>(undefined);

  const {
    data: employeeDetails,
    isLoading,
    isError,
  } = useEmployeeDetails(Number.parseInt(id));

  const { data: storesData } = useStores({
    size: 100000,
    minified: true,
  });

  const { data: locationsData } = useLocations({
    size: 100000,
    minified: true,
  });

  const { data: repositories = { data: [] } } = useRepositories({
    size: 100000,
    minified: true,
    forBranch: true,
  });

  const { data: branches } = useBranches({
    size: 100000,
    minified: true,
  });
  const {
    data: employeesData = {
      data: [],
    },
  } = useEmployees({
    size: 100000,
    minified: true,
    roles: ["DELIVERY_AGENT"],
  });
  const form = useForm({
    validate: zodResolver(
      role === "CLIENT" || role === "CLIENT_ASSISTANT"
        ? editClientAssistantSchema
        : editEmployeeSchema,
    ),
    initialValues: {
      username: "",
      name: "",
      phone: "",
      branch: "",
      repository: "",
      role: "",
      permissions: [] as string[],
      orderStatus: [] as string[],
      password: "",
      confirmPassword: "",
      companyID: "",
      avatar: [] as unknown as FileWithPath[],
      idCard: [] as unknown as FileWithPath[],
      residencyCard: [] as unknown as FileWithPath[],
      clientAssistantRole: "",
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (employeeDetails) {
      const avatarAddress = employeeDetails.data.avatar;
      const idCardAddress = employeeDetails.data.idCard;
      const residencyCardAddress = employeeDetails.data.residencyCard;
      setSelectedStores(
        employeeDetails.data.managedStores.map((s) => s.id + ""),
      );
      setSelectedBranches(
        employeeDetails.data.inquiryBranches.map((b) => b.id + ""),
      );
      setSelectedLocations(
        employeeDetails.data.inquiryLocations.map((b) => b.id + ""),
      );
      setSelectedGovernorate(employeeDetails.data.inquiryGovernorates);
      setSelectedStatuses(employeeDetails.data.inquiryStatuses);
      setSelectedEmployees(
        employeeDetails.data.inquiryDeliveryAgents.map((b) => b.id + ""),
      );
      if (
        employeeDetails.data.role === "INQUIRY_EMPLOYEE" ||
        employeeDetails.data.role === "EMPLOYEE_CLIENT_ASSISTANT"
      ) {
        setSelectedStores(
          employeeDetails.data.inquiryStores.map((s) => s.id + ""),
        );
      }
      setOrdertype(employeeDetails.data.orderType);

      form.setValues({
        username: employeeDetails.data.username,
        name: employeeDetails.data.name,
        phone: employeeDetails.data.phone,
        branch: employeeDetails.data.branch?.id.toString() || "",
        repository: employeeDetails.data.repository?.id.toString() || "",
        role: employeeDetails.data.mainEmergency
          ? "MAIN_EMERGENCY_EMPLOYEE"
          : employeeDetails.data.emergency
            ? "EMERGENCY_EMPLOYEE"
            : employeeDetails.data.role,
        companyID: employeeDetails.data.company?.id.toString(),
        permissions: employeeDetails.data?.permissions,
        orderStatus: employeeDetails.data?.orderStatus,
        avatar: [avatarAddress] as unknown as FileWithPath[],
        idCard: [idCardAddress] as unknown as FileWithPath[],
        residencyCard: [residencyCardAddress] as unknown as FileWithPath[],
        clientAssistantRole: employeeDetails.data.clientAssistantRole || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeDetails]);

  const transformedBranches = branches?.data?.map((branch) => ({
    value: branch.id.toString(),
    label: branch.name,
  }));

  const queryClient = useQueryClient();
  const { mutate: editEmployeeAction, isLoading: isEditing } = useMutation({
    mutationFn: (data: FormData) => {
      return editEmployeeService({
        data,
        id: Number.parseInt(id),
      });
    },
    onSuccess: () => {
      toast.success("تم تعديل الموظف بنجاح");
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });
      navigate("/employees");
    },
    onError: (error: AxiosError<APIError>) => {
      toast.error(error.response?.data.message || "حدث خطأ ما");
    },
  });

  const handleSubmit = (values: z.infer<typeof editEmployeeSchema>) => {
    const formData = new FormData();

    formData.append("username", values.username);
    formData.append("name", values.name);
    formData.append("phone", values.phone);
    formData.append("branchID", values.branch || "");
    formData.append("repositoryID", values.repository || "");
    if (role === "CLIENT" || role === "CLIENT_ASSISTANT") {
      formData.append("role", "CLIENT_ASSISTANT");
      formData.append(
        "clientAssistantRole",
        String(values.clientAssistantRole),
      );
      formData.append("storesIDs", JSON.stringify(selectedStores));
    } else {
      formData.append("role", values.role);
    }
    if (isAdminOrAdminAssistant) {
      formData.append("companyID", values.companyID);
    } else {
      formData.append("companyID", loggedInCompanyId.toString());
    }
    formData.append("permissions", JSON.stringify(values.permissions));
    if (
      form.values.role === "INQUIRY_EMPLOYEE" ||
      form.values.role === "MAIN_EMERGENCY_EMPLOYEE" ||
      form.values.role === "EMERGENCY_EMPLOYEE"
    ) {
      const selectedBranchesIDs = selectedBranches?.map((store) =>
        Number(store),
      );

      formData.append(
        "inquiryBranchesIDs",
        JSON.stringify(selectedBranchesIDs),
      );

      const selectedLocationsIDs = selectedLocations?.map((location) =>
        Number(location),
      );
      formData.append(
        "inquiryLocationsIDs",
        JSON.stringify(selectedLocationsIDs),
      );
      formData.append(
        "inquiryDeliveryAgentsIDs",
        JSON.stringify(selectedEmployees),
      );
      formData.append("inquiryStatuses", JSON.stringify(selectedStatuses));

      const selectedStoresIDs = selectedStores?.map((store) => Number(store));
      formData.append("inquiryStoresIDs", JSON.stringify(selectedStoresIDs));
      formData.append(
        "inquiryGovernorates",
        JSON.stringify(selectedGovernorate),
      );
    }
    if (form.values.role === "EMPLOYEE_CLIENT_ASSISTANT") {
      const selectedStoresIDs = selectedStores?.map((store) => Number(store));
      formData.append("inquiryStoresIDs", JSON.stringify(selectedStoresIDs));
    }

    if (form.values.role === "REPOSITORIY_EMPLOYEE") {
      const selectedBranchesIDs = selectedBranches?.map((store) =>
        Number(store),
      );
      formData.append(
        "inquiryBranchesIDs",
        JSON.stringify(selectedBranchesIDs),
      );
    }
    orderType ? formData.append("orderType", orderType) : null;

    formData.append("orderStatus", JSON.stringify(values.orderStatus));
    if (values.password) {
      formData.append("password", values.password);
    }
    if (values.avatar[0] instanceof File) {
      formData.append("avatar", (values?.avatar[0] as File) || "");
    }
    if (values.idCard[0] instanceof File) {
      formData.append("idCard", (values?.idCard[0] as File) || "");
    }
    if (values.residencyCard[0] instanceof File) {
      formData.append(
        "residencyCard",
        (values?.residencyCard[0] as File) || "",
      );
    }

    editEmployeeAction(formData);
  };

  return (
    <AppLayout isLoading={isLoading} isError={isError}>
      <div className="flex items-center gap-4">
        <ChevronRight
          size={34}
          className="mt-3 cursor-pointer"
          onClick={() => {
            navigate("/employees");
          }}
        />
        <h1 className="text-3xl font-semibold">تعديل موظف</h1>
      </div>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Grid gutter="md">
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
            <TextInput
              label="رقم الهاتف"
              placeholder=""
              size="md"
              className="w-full"
              {...form.getInputProps("phone")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
            <TextInput
              label="اسم المستخدم"
              placeholder=""
              size="md"
              className="w-full"
              {...form.getInputProps("username")}
            />
          </Grid.Col>
          {role !== "CLIENT" && role !== "CLIENT_ASSISTANT" ? (
            <>
              <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                <Select
                  searchable
                  label="الفرع"
                  placeholder="اختار الفرع"
                  data={transformedBranches}
                  limit={100}
                  {...form.getInputProps("branch")}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                <Select
                  searchable
                  label="المخزن"
                  placeholder="اختار المخزن"
                  data={
                    form.values.branch !== "" && repositories.data
                      ? getSelectOptions(
                          repositories.data?.filter(
                            (r) => r.branchId === +form.values.branch,
                          ) || [],
                        )
                      : getSelectOptions(repositories.data || [])
                  }
                  limit={100}
                  {...form.getInputProps("repository")}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                {isBranchManager ? (
                  <Select
                    label="الادوار"
                    placeholder="اختار الادوار"
                    defaultValue={employeeDetails?.data.role}
                    disabled
                    data={rolesArray.filter(
                      (role) =>
                        role.value !== "ADMIN" &&
                        role.value !== "CLIENT_ASSISTANT" &&
                        role.value !== "ADMIN_ASSISTANT",
                    )}
                  />
                ) : (
                  <Select
                    label="الادوار"
                    defaultValue={employeeDetails?.data.role}
                    placeholder="اختار الادوار"
                    data={rolesArray.filter(
                      (role) =>
                        role.value !== "ADMIN" &&
                        role.value !== "ADMIN_ASSISTANT",
                    )}
                    {...form.getInputProps("role")}
                  />
                )}
              </Grid.Col>
            </>
          ) : (
            <>
              <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                <TextInput
                  label="الدور"
                  placeholder=""
                  size="md"
                  className="w-full"
                  {...form.getInputProps("clientAssistantRole")}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                <MultiSelect
                  value={selectedStores}
                  label="المتاجر"
                  searchable
                  clearable
                  onChange={(e) => {
                    setSelectedStores(e);
                  }}
                  placeholder="اختر المتجر"
                  data={getSelectOptions(storesData?.data || [])}
                  limit={100}
                />
              </Grid.Col>
            </>
          )}
          <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
            <MultiSelect
              label="الصلاحيات"
              placeholder="اختار الصلاحيات"
              readOnly={isBranchManager}
              data={
                role === "COMPANY_MANAGER" &&
                form.values.role !== "EMPLOYEE_CLIENT_ASSISTANT"
                  ? permissionsArray
                  : role !== "CLIENT" &&
                      role !== "CLIENT_ASSISTANT" &&
                      form.values.role !== "EMPLOYEE_CLIENT_ASSISTANT"
                    ? permissionsArray.filter(
                        (e) => e.value !== "CHANGE_CLOSED_ORDER_STATUS",
                      )
                    : clientAssistantPermissionsArray
              }
              {...form.getInputProps("permissions")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
            <MultiSelect
              label="الحالات"
              placeholder="اختار الحالات"
              readOnly={isBranchManager}
              data={orderStatusArray}
              {...form.getInputProps("orderStatus")}
            />
          </Grid.Col>
          {form.values.role === "REPOSITORIY_EMPLOYEE" ? (
            <Grid.Col span={{ base: 12, md: 6, lg: 4, sm: 12, xs: 12 }}>
              <MultiSelect
                value={selectedBranches}
                label="اسناد فروع لموظفين المخازن"
                searchable
                clearable
                onChange={(e) => {
                  setSelectedBranches(e);
                }}
                placeholder="اختر الفرع"
                data={getSelectOptions(branches?.data || [])}
                limit={100}
              />
            </Grid.Col>
          ) : null}
          {form.values.role === "EMPLOYEE_CLIENT_ASSISTANT" ? (
            <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
              <MultiSelect
                value={selectedStores}
                label="اسناد متاجر لمساعد العميل"
                searchable
                clearable
                onChange={(e) => {
                  setSelectedStores(e);
                }}
                placeholder="اختر المتجر"
                data={getSelectOptions(storesData?.data || [])}
                limit={100}
              />
            </Grid.Col>
          ) : null}
          {form.values.role === "INQUIRY_EMPLOYEE" ||
          form.values.role === "MAIN_EMERGENCY_EMPLOYEE" ||
          form.values.role === "EMERGENCY_EMPLOYEE" ? (
            <>
              <Grid.Col span={{ base: 12, md: 6, lg: 4, sm: 12, xs: 12 }}>
                <MultiSelect
                  value={selectedBranches}
                  label="اسناد فروع لموظفين الدعم والمتابعه"
                  searchable
                  clearable
                  onChange={(e) => {
                    setSelectedBranches(e);
                  }}
                  placeholder="اختر الفرع"
                  data={getSelectOptions(branches?.data || [])}
                  limit={100}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6, lg: 4, sm: 12, xs: 12 }}>
                <Select
                  label="نوع البريد"
                  placeholder="اختار نوع البريد"
                  data={[
                    { value: "forwarded", label: "البريد الصادر" },
                    { value: "receiving", label: "البريد الوارد" },
                  ]}
                  onChange={(e) => setOrdertype(e || undefined)}
                  value={orderType}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6, lg: 4, sm: 12, xs: 12 }}>
                <MultiSelect
                  value={selectedLocations}
                  label="اسناد مناطق لموظفين الدعم والمتابعه"
                  searchable
                  clearable
                  onChange={(e) => {
                    setSelectedLocations(e);
                  }}
                  placeholder="اختر المنطقة"
                  data={
                    selectedBranches.length > 0
                      ? getSelectOptions(
                          locationsData?.data.filter((s) =>
                            selectedBranches.includes(s.branchId + ""),
                          ) || [],
                        )
                      : getSelectOptions(locationsData?.data || [])
                  }
                  limit={100}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6, lg: 4, sm: 12, xs: 12 }}>
                <MultiSelect
                  value={selectedStatuses}
                  label="اسناد حالات لموظفين الدعم والمتابعه"
                  searchable
                  clearable
                  onChange={(e) => {
                    setSelectedStatuses(e);
                  }}
                  placeholder="اختر الحالة"
                  data={orderStatusArray}
                  limit={100}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6, lg: 4, sm: 12, xs: 12 }}>
                <MultiSelect
                  value={selectedStores}
                  label="اسناد متاجر لموظفين الدعم والمتابعه"
                  searchable
                  clearable
                  onChange={(e) => {
                    setSelectedStores(e);
                  }}
                  placeholder="اختر المتجر"
                  data={
                    selectedBranches.length > 0
                      ? getSelectOptions(
                          storesData?.data.filter((s) =>
                            selectedBranches.includes(s.client.branchId + ""),
                          ) || [],
                        )
                      : getSelectOptions(storesData?.data || [])
                  }
                  limit={100}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6, lg: 4, sm: 12, xs: 12 }}>
                <MultiSelect
                  value={selectedGovernorate}
                  label="اسناد محافظات لموظفين الدعم والمتابعه"
                  searchable
                  clearable
                  onChange={(e) => {
                    setSelectedGovernorate(e);
                  }}
                  placeholder="اختر محافظه"
                  data={governorateArray}
                  limit={100}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6, lg: 4, sm: 12, xs: 12 }}>
                <MultiSelect
                  value={selectedEmployees}
                  label="اسناد مندوبين لموظفين الدعم والمتابعه"
                  searchable
                  clearable
                  onChange={(e) => {
                    setSelectedEmployees(e);
                  }}
                  placeholder="اختر مندوب"
                  data={
                    selectedBranches.length > 0
                      ? getSelectOptions(
                          employeesData?.data.filter((s) =>
                            selectedBranches.includes(s.branchId + ""),
                          ) || [],
                        )
                      : getSelectOptions(employeesData?.data || [])
                  }
                  limit={100}
                />
              </Grid.Col>
            </>
          ) : null}
          <Grid.Col span={{ base: 12, md: 12, lg: 12, sm: 12, xs: 12 }}>
            <h1 className="text-2xl font-semibold text-center mb-2">
              الصورة الشخصية
            </h1>
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
            <h1 className="text-2xl font-semibold text-center mb-2">الهوية</h1>
            {role !== "CLIENT" && role !== "CLIENT_ASSISTANT" ? (
              <>
                <ImageUploader
                  image={form.values.idCard}
                  onDrop={(files) => {
                    form.setFieldValue("idCard", files);
                  }}
                  onDelete={() => {
                    form.setFieldValue("idCard", []);
                  }}
                  error={!!form.errors.idCard}
                />
                {form.errors.idCard && (
                  <div className="text-red-500">{form.errors.idCard}</div>
                )}
                <h1 className="text-2xl font-semibold text-center mb-2">
                  الإقامة
                </h1>
                <ImageUploader
                  image={form.values.residencyCard}
                  onDrop={(files) => {
                    form.setFieldValue("residencyCard", files);
                  }}
                  onDelete={() => {
                    form.setFieldValue("residencyCard", []);
                  }}
                  error={!!form.errors.residencyCard}
                />
                {form.errors.residencyCard && (
                  <div className="text-red-500">
                    {form.errors.residencyCard}
                  </div>
                )}
              </>
            ) : null}
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
            <PasswordInput
              label="كلمة المرور"
              placeholder="*******"
              mt="md"
              size="md"
              className="w-full"
              {...form.getInputProps("password")}
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
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
            <Button
              loading={isEditing}
              disabled={isEditing || !form.isDirty}
              type="submit"
              fullWidth
              mt="xl"
              size="md">
              تعديل
            </Button>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
            <Button
              onClick={() => {
                form.reset();
                navigate("/employees");
              }}
              type="reset"
              fullWidth
              mt="xl"
              size="md"
              variant="outline">
              الغاء
            </Button>
          </Grid.Col>
        </Grid>
      </form>
    </AppLayout>
  );
};
