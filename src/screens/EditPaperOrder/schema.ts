import * as z from "zod";
// import { isValidIraqiPhoneNumber } from '@/lib/testIraqiPhoneNumber';

export interface CreateBulkOrdersSchema {
  id: string;
  withProducts: boolean;
  totalCost: string;
  quantity: string;
  recipientName: string;
  recipientPhones: {
    phone: string;
    key: string;
  }[];
  recipientAddress: string;
  notes: string;
  details: string;
  deliveryType: string;
  governorate: string;
  locationID: string;
  storeID: string;
  receiptNumber: string;
}

export const createOrderSchema = z
  .object({
    unique: z.boolean(),
    recipientName: z.string(),
    forwardedCompanyID: z.string().optional(),
    receiptNumber: z.string().optional(),
    recipientPhones: z.array(
      z.object(
        {
          phone: z.string().min(11, {
            message: "رقم الهاتف يجب ان يكون ١١ رقم على الأقل",
          }),
          key: z.any(),
        },
        {
          required_error: "مطلوب",
        },
      ),
    ),
    notes: z.string().optional(),
    governorate: z.string().optional(),
    details: z.string({
      required_error: "مطلوب",
    }),
    locationID: z.string().min(1, { message: "الرجاء اختيار الموقع" }),
    storeID: z.string().min(1, { message: "الرجاء اختيار المتجر" }),
  })
  .and(
    z.discriminatedUnion("withProducts", [
      z.object({
        withProducts: z.literal(true),
        products: z
          .array(
            z.object({
              productID: z.string().min(1, { message: "الرجاء اختيار المنتج" }),
              quantity: z.string().min(1, { message: "الرجاء ادخال الكمية" }),
              colorID: z.string().min(1, { message: "الرجاء اختيار اللون" }),
              sizeID: z.string().min(1, { message: "الرجاء اختيار المقاس" }),
            }),
          )
          .min(1, { message: "الرجاء اختيار المنتجات" })
          .optional(),
      }),
      z.object({
        withProducts: z.literal(false),
        totalCost: z.number().optional(),
        quantity: z
          .string()
          .min(1, { message: "الرجاء ادخال الكمية" })
          .optional(),
      }),
    ]),
  );
