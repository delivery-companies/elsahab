import { AppLayout } from "@/components/AppLayout";
import { usePublicLocations } from "@/hooks/usePublicLocations";
import { useStores } from "@/hooks/useStores";
import { getSelectOptions } from "@/lib/getSelectOptions";
import type { APIError } from "@/models";
import {
  type CreateOrderPayload,
  createOrderService,
} from "@/services/createOrder";
import { Button, Select, rem } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { SheetUploader } from "./components/SheetUploader";
import { DataTable } from "./components/Table";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { columns } from "./components/columns";
import { useOrderSheet } from "@/hooks/useOrderSheet";

export interface OrderSheet {
  phoneNumber: string;
  address: string;
  city: string;
  notes: string;
  total: string;
  Governorate: string;
}

interface SheetFile {
  العنوان: string;
  المنطقة: string;
  الملاحظات: string;
  "رقم الهاتف": string;
  "المبلغ الكلي": string;
  المحافظة: string;
}

export const OrdersSheet = () => {
  const queryClient = useQueryClient();
  const [files, setFiles] = useState<File[]>([]);
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [orders, setOrders] = useState<OrderSheet[]>([]);
  const { data: publicLocationData } = usePublicLocations();

  const handleDrop = useCallback((files: File[]) => {
    setFiles(files);
    const reader = new FileReader();
    reader.readAsBinaryString(files[0]);
    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const json: SheetFile[] = XLSX.utils.sheet_to_json(sheet);
      const transformedJson: OrderSheet[] = json.map((order) => ({
        address: order.المنطقة + " - " + order.العنوان,
        city: order.المنطقة,
        notes: order.الملاحظات,
        phoneNumber: order["رقم الهاتف"].toString().startsWith("0")
          ? order["رقم الهاتف"]
          : "0" + order["رقم الهاتف"],
        total: order["المبلغ الكلي"],
        Governorate: order.المحافظة,
      }));

      setOrders(transformedJson);
    };
  }, []);

  const {
    data: storesData = {
      data: [],
    },
  } = useStores({ size: 100000, minified: true });

  const { mutate: createOrder, isLoading } = useMutation({
    mutationFn: (data: CreateOrderPayload) => {
      return createOrderService(data);
    },
    onSuccess: () => {
      toast.success("تم اضافة الطلبات بنجاح");
      setOrders([]);
      setFiles([]);
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
      queryClient.invalidateQueries({
        queryKey: ["ordersStatistics"],
      });
    },
    onError: (error: AxiosError<APIError>) => {
      toast.error(error.response?.data.message || "حدث خطأ ما");
    },
  });

  const governorateMapArabicToEnglish: Record<string, string> = {
    الأنبار: "AL_ANBAR",
    بابل: "BABIL",
    بغداد: "BAGHDAD",
    البصرة: "BASRA",
    "ذي قار": "DHI_QAR",
    القادسية: "AL_QADISIYYAH",
    السليمانية: "SULAYMANIYAH",
    ديالى: "DIYALA",
    دهوك: "DUHOK",
    أربيل: "ERBIL",
    كربلاء: "KARBALA",
    كركوك: "KIRKUK",
    ميسان: "MAYSAN",
    المثنى: "MUTHANNA",
    النجف: "NAJAF",
    نينوى: "NINAWA",
    "صلاح الدين": "SALAH_AL_DIN",
    واسط: "WASIT",
    "شركات بابل": "BABIL_COMPANIES",
  };

  const handleCreateOrders = () => {
    if (!selectedStore) {
      toast.error("يجب اختيار المتجر");
      return;
    }
    const data = orders.map((order) => ({
      withProducts: false,
      storeID: Number(selectedStore),
      locationID: publicLocationData?.find(
        (location) => location.name === order.Governorate
      )?.id,
      governorate: governorateMapArabicToEnglish[order.Governorate],
      notes: order.notes,
      recipientPhones: [order.phoneNumber],
      recipientAddress: order.address,
      totalCost: Number(order.total),
    }));
    createOrder(data);
  };

  const { mutateAsync: downloadSheet, isLoading: excelLoading } =
    useOrderSheet();

  const handleDownload = () => {
    toast.promise(downloadSheet(), {
      loading: "جاري تحميل الملف...",
      success: "تم تحميل الملف بنجاح",
      error: (error) => {
        return error.message || "حدث خطأ ما";
      },
    });
  };
  return (
    <AppLayout>
      <Button w={rem(200)} onClick={handleDownload} loading={excelLoading}>
        تحميل قالب الاكسيل
      </Button>
      <Select
        searchable
        className="mb-4 mt-4"
        label="المتجر"
        placeholder="اختار المتجر"
        limit={50}
        data={getSelectOptions(storesData.data)}
        value={selectedStore}
        onChange={setSelectedStore}
      />
      <SheetUploader
        onDelete={() => {
          setFiles([]);
          setOrders([]);
        }}
        files={files}
        onDrop={handleDrop}
      />
      <div className="flex justify-center mb-6">
        <Button
          w={rem(200)}
          onClick={handleCreateOrders}
          loading={isLoading}
          disabled={isLoading || !orders.length}>
          اضافة الطلبات
        </Button>
      </div>
      <DataTable data={orders} columns={columns} />
    </AppLayout>
  );
};
