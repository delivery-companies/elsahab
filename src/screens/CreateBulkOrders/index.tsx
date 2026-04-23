import { AppLayout } from "@/components/AppLayout";
import { hideChildrenBasedOnRole } from "@/hooks/useAuthorized";
import { useStores } from "@/hooks/useStores";
import { useTenants } from "@/hooks/useTenants";
import { getSelectOptions } from "@/lib/getSelectOptions";
import type { APIError } from "@/models";
import {
  createOrderService,
  type CreateOrderPayload,
} from "@/services/createOrder";
import { Button, Grid, Select, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { randomId, useDisclosure } from "@mantine/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { BulkOrdersItem } from "./components/BulkOrdersItem";
import { CreateClientAndStoreModal } from "./components/CreateClientAndStoreModal";
// import { z } from 'zod';
import { CreateStoreModal } from "./components/CreateStoreModal";
import { createBulkOfOrdersSchema } from "./schema";
import { useAuth } from "@/store/authStore";

export interface OrderBulkFormValues {
  orders: {
    unique: boolean;
    orderDelivery: boolean;
    id: string;
    withProducts: boolean;
    recipientPhones: {
      phone: string;
      key: string;
    }[];
    totalCost: number | undefined;
    quantity: string;
    storeID: string;
    locationID: string;
    deliveryType: string;
    governorate: string;
    recipientName: string;
    recipientAddress: string;
    receiptNumber: string | undefined;
    details: string;
    notes: string;
    forwardedCompanyID?: string;
    products?: {
      productID: string;
      quantity: string;
      colorID: string;
      sizeID: string;
      label?: string;
    }[];
  }[];
}

const createBulkOrdersSelect = [
  {
    label: "صفحة",
    value: "page",
  },
  {
    label: "محافظة",
    value: "governorate",
  },
];

export const CreateBulkOrders = () => {
  const [active, { toggle }] = useDisclosure(false);
  const [focusedFormItem, setFocusedFormItem] = useState<number | null>(null);

  const [ordersTotals, setOrdersTotals] = useState(1);
  const [createBulkOrdersBy, setCreateBulkOrdersBy] = useState<string | null>(
    "governorate"
  );
  const [selectedGovernorate, setSelectedGovernorate] = useState<
    string | null
  >();
  const [selectedForwardedCompany, setSelectedForwardedCompany] = useState<
    string | null
  >();
  const [selectedStore, setSelectedStore] = useState<string | null>();
  const queryClient = useQueryClient();
  const { role } = useAuth();
  const form = useForm<OrderBulkFormValues>({
    initialValues: {
      orders: [
        {
          id: randomId(),
          withProducts: false,
          recipientPhones: [
            {
              phone: "",
              key: randomId(),
            },
          ],
          totalCost: undefined,
          quantity: "1",
          storeID: "",
          locationID: "",
          deliveryType: "",
          governorate: "",
          recipientName: "",
          recipientAddress: "",
          receiptNumber: "",
          details: "",
          notes: "",
          forwardedCompanyID: "",
          unique: true,
          orderDelivery: false,
        },
      ],
    },
    validate: zodResolver(createBulkOfOrdersSchema),
  });

  const {
    data: storesData = {
      data: [],
    },
  } = useStores({ size: 100000, minified: true });
  const {
    data: companiesData = {
      data: [],
    },
  } = useTenants({ size: 100000, minified: true, main_company: true });

  const ordersArray = form.values.orders;

  const handleAddOrdersToForm = () => {
    const newAddedOrdersCount = ordersTotals;
    const newOrdersArray = [...ordersArray];
    for (let i = 0; i < newAddedOrdersCount; i += 1) {
      newOrdersArray.push({
        id: randomId(),
        withProducts: false,
        recipientPhones: [
          {
            phone: "",
            key: randomId(),
          },
        ],
        totalCost: undefined,
        quantity: "1",
        storeID: "",
        locationID: "",
        deliveryType: "",
        governorate: "",
        recipientName: "",
        recipientAddress: "",
        receiptNumber: "",
        details: "",
        notes: "",
        unique: true,
        orderDelivery: false,
      });
    }

    form.setValues({ orders: newOrdersArray });
  };
  const handleDeleteOrder = (index: number) => {
    if (ordersArray.length === 1) {
      return;
    }
    form.removeListItem("orders", index);
  };

  const { mutate: createOrder, isLoading } = useMutation({
    mutationFn: (data: CreateOrderPayload) => {
      return createOrderService(data);
    },
    onSuccess: () => {
      toast.success("تم اضافة الطلب بنجاح");
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
      queryClient.invalidateQueries({
        queryKey: ["ordersStatistics"],
      });
      form.reset();
      setOrdersTotals(1);
      setSelectedGovernorate(null);
      setSelectedStore(null);
    },
    onError: (error: AxiosError<APIError>) => {
      toast.error(error.response?.data.message || "حدث خطأ ما");
    },
  });

  const handleSubmit = () => {
    const { values } = form;
    const ordersArray = values.orders.map((order) => {
      if (order.withProducts) {
        return {
          withProducts: order.withProducts,
          forwardedCompanyID: Number(selectedForwardedCompany) || undefined,
          governorate: order.governorate,
          recipientAddress: order.details,
          recipientName: order.recipientName || "افتراضي",
          recipientPhones: order.recipientPhones.map((phone) => phone.phone),
          receiptNumber: order.receiptNumber || undefined,
          storeID: Number(selectedStore),
          locationID: Number(order.locationID),
          details: order.details,
          notes: order.notes,
          products: order.products?.map((product) => {
            return {
              productID: Number(product.productID),
              quantity: Number(product.quantity),
              colorID: Number(product.colorID),
              sizeID: Number(product.sizeID),
            };
          }),
        };
      }
      return {
        withProducts: order.withProducts,
        forwardedCompanyID: Number(selectedForwardedCompany) || undefined,
        governorate: selectedGovernorate || order.governorate || "",
        recipientAddress: order.recipientAddress,
        recipientName: order.recipientName || "افتراضي",
        recipientPhones: order.recipientPhones.map((phone) => phone.phone),
        receiptNumber: order.receiptNumber || undefined,
        storeID: Number(selectedStore || order.storeID),
        details: order.details,
        quantity: Number(order.quantity),
        notes: order.notes,
        locationID: Number(order.locationID),
        totalCost: order.orderDelivery
          ? Number(order.totalCost ? -order.totalCost : 0)
          : Number(order.totalCost),
      };
    });
    createOrder(ordersArray);
  };

  const onKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      toggle();
    }
  };

  return (
    <AppLayout>
      <div className="flex gap-4 flex-wrap">
        <CreateStoreModal />
        {hideChildrenBasedOnRole(["CLIENT"], <CreateClientAndStoreModal />)}
      </div>
      <div className="flex items-center gap-4 mb-6">
        <TextInput
          label="عدد الطلبات"
          type="number"
          size="xs"
          value={ordersTotals}
          onChange={(e) => {
            setOrdersTotals(Number.parseInt(e.currentTarget.value));
          }}
        />
        <Button
          size="md"
          variant="outline"
          color="blue"
          className="mt-6"
          onClick={handleAddOrdersToForm}>
          انشاء
        </Button>
      </div>
      <Grid>
        <Grid.Col span={{ xs: 12, sm: 6, md: 4 }}>
          <Select
            allowDeselect={false}
            size="xs"
            data={createBulkOrdersSelect}
            value={createBulkOrdersBy}
            label="ادخال حسب"
            placeholder="اختر الطريقة"
            onChange={(e) => {
              setCreateBulkOrdersBy(e);
              setSelectedGovernorate(null);
              setSelectedStore(null);
            }}
          />
        </Grid.Col>
        <Grid.Col span={{ xs: 12, sm: 6, md: 4 }}>
          <Select
            clearable
            data={getSelectOptions(storesData?.data || [])}
            label="المتجر"
            searchable
            value={selectedStore}
            onChange={(e) => {
              setSelectedStore(e);
            }}
            allowDeselect={false}
            placeholder="اختر المتجر"
            size="xs"
          />
          {/* {createBulkOrdersBy === "page" && (
            <Select
              clearable
              data={getSelectOptions(storesData?.data || [])}
              label="المتجر"
              searchable
              value={selectedStore}
              onChange={(e) => {
                setSelectedStore(e);
              }}
              allowDeselect={false}
              placeholder="اختر المتجر"
              size="xs"
            />
          )} */}
        </Grid.Col>
        {role !== "CLIENT_ASSISTANT" && role !== "CLIENT" ? (
          <Grid.Col span={{ xs: 12, sm: 6, md: 4 }}>
            <Select
              clearable
              data={getSelectOptions(companiesData?.data || [])}
              label="الشركة المسند اليها الطلبات"
              searchable
              allowDeselect={false}
              placeholder="اختر الشركة"
              size="xs"
              value={selectedForwardedCompany}
              onChange={(e) => {
                setSelectedForwardedCompany(e);
              }}
            />
          </Grid.Col>
        ) : null}
      </Grid>
      <div>
        {ordersArray.map((order, index) => (
          <BulkOrdersItem
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                if (ordersArray.length - 1 > index) {
                  onKeyUp(e);
                  setFocusedFormItem(index + 1);
                }
              }
              // console.log("onKeyUp", e.key, index, ordersArray.length - 1);
            }}
            active={active && focusedFormItem === index}
            selectedGovernorate={selectedGovernorate}
            form={form}
            handleDeleteOrder={handleDeleteOrder}
            index={index}
            storesData={storesData.data}
            createBulkOrdersBy={createBulkOrdersBy}
            key={order.id}
          />
        ))}
        <Button
          loading={isLoading}
          onClick={() => {
            form.onSubmit(handleSubmit)();
          }}
          disabled={isLoading || !selectedStore}
          type="submit"
          fullWidth
          mt="xl"
          size="md">
          رفع وتأكيد
        </Button>
      </div>
    </AppLayout>
  );
};
