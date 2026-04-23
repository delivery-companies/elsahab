import { AppLayout } from "@/components/AppLayout";
import { ImageUploader } from "@/components/CustomDropZone";
import { useBranches } from "@/hooks/useBranches";
import { useEmployeeDetails } from "@/hooks/useEmployeeDetails";
import { useRepositories } from "@/hooks/useRepositories";
import { useTenants } from "@/hooks/useTenants";
import { getSelectOptions } from "@/lib/getSelectOptions";
import {
  clientAssistantPermissionsArray,
  permissionsArray,
} from "@/lib/persmissionArabicNames";
import {
  rolesArray,
  branchRolesArray,
  ROLE_CONFIG,
} from "@/lib/rolesArabicNames";
import type { APIError } from "@/models";
import { createEmployeeService } from "@/services/createEmployee";
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
import { useNavigate } from "react-router-dom";
import type { z } from "zod";
import { addClientAssistantSchema, addEmployeeSchema } from "./schema";
import { orderStatusArray } from "@/lib/orderStatusArabicNames";
import { useStores } from "@/hooks/useStores";
import { useLocations } from "@/hooks/useLocations";
import { governorateArray } from "@/lib/governorateArabicNames ";
import { useEmployees } from "@/hooks/useEmployees";

export const AddEmployee = () => {
  const navigate = useNavigate();
  const { role, id: loggedInUserId, companyID: loggedInCompanyId } = useAuth();
  const isAdminOrAdminAssistant =
    role === "ADMIN" || role === "ADMIN_ASSISTANT";
  const isBranchManager = role === "BRANCH_MANAGER";

  const { data: storesData } = useStores({
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
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedGovernorate, setSelectedGovernorate] = useState<string[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [orderType, setOrdertype] = useState<string | undefined>(undefined);

  const { data: locationsData } = useLocations({
    size: 100000,
    minified: true,
  });

  const {
    data: employeeDetails,
    isLoading: isFetchingBranchManagerDetailsLoading,
    isError: isFetchingBranchManagerDetailsError,
  } = useEmployeeDetails(Number(loggedInUserId), !isAdminOrAdminAssistant);

  const { data: branches = { data: [] } } = useBranches({
    size: 100000,
    minified: true,
  });

  const { data: tenants = { data: [] } } = useTenants(
    { size: 100000, minified: true },
    isAdminOrAdminAssistant,
  );

  const form = useForm({
    validate: zodResolver(
      role === "CLIENT" || role === "CLIENT_ASSISTANT"
        ? addClientAssistantSchema
        : addEmployeeSchema,
    ),
    initialValues: {
      username: "",
      name: "",
      phone: "",
      branch: "",
      store: "",
      roles: "",
      permissions: [],
      orderStatus: [],
      password: "",
      confirmPassword: "",
      companyID: "",
      avatar: [] as unknown as FileWithPath[],
      idCard: [] as unknown as FileWithPath[],
      residencyCard: [] as unknown as FileWithPath[],
      clientAssistantRole: "",
    },
  });

  const { data: repositories = { data: [] } } = useRepositories({
    size: 100000,
    minified: true,
    forBranch: true,
    branchId: form.values.branch,
  });
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (employeeDetails) {
      form.setFieldValue(
        "companyID",
        employeeDetails?.data?.company?.id?.toString(),
      );

      form.setFieldValue(
        "branch",
        employeeDetails?.data?.branch?.id?.toString() || "",
      );
    } else {
      form.setFieldValue("companyID", loggedInCompanyId);
    }

    if (isBranchManager) {
      const roleConfig = ROLE_CONFIG[form.values.roles];

      if (roleConfig) {
        form.setFieldValue("permissions", roleConfig.permissions as never);
        form.setFieldValue("orderStatus", roleConfig.orderStatus as never);
      }
    }
  }, [employeeDetails, isBranchManager, form.values.roles]);

  const queryClient = useQueryClient();

  const { mutate: createBranchAction, isLoading } = useMutation({
    mutationFn: (data: FormData) => {
      return createEmployeeService(data);
    },
    onSuccess: () => {
      toast.success("تم اضافة الموظف بنجاح");
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });
      form.resetDirty();
    },
    onError: (error: AxiosError<APIError>) => {
      toast.error(error.response?.data.message || "حدث خطأ ما");
    },
  });

  const handleSubmit = (values: z.infer<typeof addEmployeeSchema>) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("username", values.username);
    formData.append("phone", values.phone);
    formData.append("branchID", values.branch);
    const selectedStoresIDs = selectedStores?.map((store) => Number(store));

    if (values.store) {
      formData.append("repositoryID", values.store);
    }

    if (role === "CLIENT" || role === "CLIENT_ASSISTANT") {
      formData.append("role", "CLIENT_ASSISTANT");
      formData.append(
        "clientAssistantRole",
        String(values.clientAssistantRole),
      );
      formData.append("storesIDs", JSON.stringify(selectedStores));
    } else {
      formData.append("role", values.roles);
    }

    formData.append("password", values.password);
    formData.append("avatar", values.avatar[0]);
    formData.append("idCard", values.idCard[0]);
    formData.append("residencyCard", values.residencyCard[0]);

    const selectedBranchesIDs = selectedBranches?.map((store) => Number(store));

    formData.append("inquiryBranchesIDs", JSON.stringify(selectedBranchesIDs));

    const selectedLocationsIDs = selectedLocations?.map((location) =>
      Number(location),
    );

    formData.append(
      "inquiryLocationsIDs",
      JSON.stringify(selectedLocationsIDs),
    );

    formData.append("inquiryStatuses", JSON.stringify(selectedStatuses));

    formData.append("inquiryStoresIDs", JSON.stringify(selectedStoresIDs));

    formData.append(
      "inquiryDeliveryAgentsIDs",
      JSON.stringify(selectedEmployees),
    );

    formData.append("inquiryGovernorates", JSON.stringify(selectedGovernorate));

    orderType ? formData.append("orderType", orderType) : null;
    // TODO: DELETE THE SALARY LATER
    formData.append("salary", "220");
    if (isAdminOrAdminAssistant) {
      formData.append("companyID", String(values.companyID));
    } else {
      formData.append("companyID", loggedInCompanyId.toString());
    }
    formData.append("permissions", JSON.stringify(values.permissions));
    if (values.orderStatus.length > 0) {
      formData.append("orderStatus", JSON.stringify(values.orderStatus));
    }

    createBranchAction(formData);
  };

  const handleReturn = () => {
    if (role === "BRANCH_MANAGER") {
      navigate(-1);
      return;
    }
    navigate("/employees");
  };

  return (
    <AppLayout
      isLoading={isBranchManager && isFetchingBranchManagerDetailsLoading}
      isError={isBranchManager && isFetchingBranchManagerDetailsError}>
      <div className="flex items-center gap-4">
        <ChevronRight
          size={34}
          className="mt-2 cursor-pointer"
          onClick={handleReturn}
        />
        <h1 className="text-3xl font-semibold">اضافة موظف</h1>
      </div>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Grid gutter="lg">
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
                  data={getSelectOptions(branches.data || [])}
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
                  {...form.getInputProps("store")}
                />
              </Grid.Col>
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
              <Grid.Col span={{ base: 12, md: 6, lg: 6, sm: 12, xs: 12 }}>
                <Select
                  label="الادوار"
                  placeholder="اختار الادوار"
                  data={
                    isBranchManager
                      ? branchRolesArray
                      : rolesArray.filter(
                          (role) =>
                            role.value !== "ADMIN" &&
                            role.value !== "CLIENT_ASSISTANT" &&
                            role.value !== "ADMIN_ASSISTANT",
                        )
                  }
                  {...form.getInputProps("roles")}
                />
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
                form.values.roles !== "EMPLOYEE_CLIENT_ASSISTANT"
                  ? permissionsArray
                  : role !== "CLIENT" &&
                      role !== "CLIENT_ASSISTANT" &&
                      form.values.roles !== "EMPLOYEE_CLIENT_ASSISTANT"
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
          {form.values.roles === "REPOSITORIY_EMPLOYEE" ? (
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
          {form.values.roles === "EMPLOYEE_CLIENT_ASSISTANT" ? (
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
          {form.values.roles === "INQUIRY_EMPLOYEE" ||
          form.values.roles === "MAIN_EMERGENCY_EMPLOYEE" ||
          form.values.roles === "EMERGENCY_EMPLOYEE" ? (
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
            {role !== "CLIENT" && role !== "CLIENT_ASSISTANT" ? (
              <>
                <h1 className="text-2xl font-semibold text-center mb-2">
                  الهوية
                </h1>
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
              loading={isLoading}
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
                navigate("/employees");
              }}>
              الغاء
            </Button>
          </Grid.Col>
        </Grid>
      </form>
    </AppLayout>
  );
};
