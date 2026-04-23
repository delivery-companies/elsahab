import { AppLayout } from "@/components/AppLayout";
import { useBranches } from "@/hooks/useBranches";
import { useEmployees } from "@/hooks/useEmployees";
import { useLocationDetails } from "@/hooks/useLocationDetails";
import { getSelectOptions } from "@/lib/getSelectOptions";
import {
  type governorateArabicNames,
  governorateArray,
} from "@/lib/governorateArabicNames ";
import type { APIError } from "@/models";
import {
  type EditLocationPayload,
  editLocationService,
} from "@/services/editLocation";
import { Button, MultiSelect, Select, Switch, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { ChevronRight } from "lucide-react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import type { z } from "zod";
import { editLocationSchema } from "./schema";

export const EditLocation = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    data: locationDetails,
    isError,
    isLoading,
  } = useLocationDetails(Number.parseInt(id));
  const form = useForm({
    validate: zodResolver(editLocationSchema),
    initialValues: {
      name: "",
      governorate: "",
      branch: "",
      deliveryAgentsIDs: [""],
      remote: false,
    },
  });
  const {
    data: branches = {
      data: [],
    },
  } = useBranches({
    size: 100000,
    minified: true,
  });

  const {
    data: employees = {
      data: [],
    },
  } = useEmployees({
    size: 100000,
    minified: true,
    roles: ["DELIVERY_AGENT"],
  });

  useEffect(() => {
    const transformedDeliveries = locationDetails?.data?.deliveryAgents.map(
      (delivery) => delivery.id.toString()
    );

    form.setValues({
      name: locationDetails?.data.name || "",
      governorate: locationDetails?.data?.governorate || "",
      branch: locationDetails?.data?.branch?.id.toString() || "",
      deliveryAgentsIDs: transformedDeliveries || [],
      remote: locationDetails?.data?.remote,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationDetails]);

  const { mutate: editLocationAction, isLoading: isEditing } = useMutation({
    mutationFn: ({
      branchID,
      deliveryAgentsIDs,
      governorate,
      name,
      remote,
    }: EditLocationPayload) => {
      return editLocationService({
        data: {
          branchID,
          deliveryAgentsIDs,
          governorate,
          name,
          remote,
        },
        id: Number.parseInt(id),
      });
    },
    onSuccess: () => {
      toast.success("تم تعديل المنطقة بنجاح");
      queryClient.invalidateQueries({
        queryKey: ["locations"],
      });
      form.reset();
    },
    onError: (error: AxiosError<APIError>) => {
      toast.error(error.response?.data.message || "حدث خطأ ما");
    },
  });

  const handleSubmit = (values: z.infer<typeof editLocationSchema>) => {
    editLocationAction({
      branchID: Number(values.branch),
      deliveryAgentsIDs: values.deliveryAgentsIDs?.map((id) => Number(id)),
      governorate: values.governorate as keyof typeof governorateArabicNames,
      name: values.name,
      remote: values.remote,
    });
  };

  return (
    <AppLayout isError={isError} isLoading={isLoading}>
      <div className="flex items-center gap-4">
        <ChevronRight
          size={34}
          className="mt-3 cursor-pointer"
          onClick={() => {
            navigate("/locations");
          }}
        />
        <h1 className="text-3xl font-semibold">تعديل المنطقة</h1>
      </div>
      <form
        onSubmit={form.onSubmit(handleSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10"
      >
        <div className="col-span-2 flex justify-between">
          <Switch
            label="منطقة نائية"
            checked={form.values.remote}
            onChange={(event) => {
              form.setFieldValue("remote", event.currentTarget.checked);
            }}
          />
        </div>
        <TextInput
          label="الاسم"
          placeholder=""
          size="md"
          className="w-full"
          {...form.getInputProps("name")}
        />
        <Select
          label="المحافظة"
          {...form.getInputProps("governorate")}
          data={governorateArray}
        />
        <Select
          label="الفرع"
          searchable
          {...form.getInputProps("branch")}
          limit={50}
          data={getSelectOptions(branches.data)}
        />
        <MultiSelect
          label="المندوبين"
          data={getSelectOptions(employees.data)}
          limit={50}
          searchable
          {...form.getInputProps("deliveryAgentsIDs")}
        />
        <Button
          type="submit"
          fullWidth
          mt="xl"
          size="md"
          disabled={isEditing}
          loading={isEditing}
        >
          تعديل
        </Button>
        <Button
          type="reset"
          fullWidth
          mt="xl"
          size="md"
          variant="outline"
          onClick={() => {
            navigate("/locations");
          }}
        >
          الغاء
        </Button>
      </form>
    </AppLayout>
  );
};
