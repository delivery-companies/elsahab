import * as z from "zod";
// import { isValidIraqiPhoneNumber } from '@/lib/testIraqiPhoneNumber';

export interface CreateBulkOrdersSchema {
  id: string;
  withProducts: boolean;
  totalCost: string;
  quantity: string;
  weight: string;
  recipientName: string;
  recipientPhones: string[];
  recipientAddress: string;
  notes: string;
  details: string;
  deliveryType: string;
  governorate: string;
  locationID: string;
  storeID: string;
  receiptNumber: string;
}

export const createBulkOfOrdersSchema = z.object({
  orders: z.array(
    z
      .object({
        unique: z.boolean(),
        recipientName: z.string(),
        forwardedCompanyID: z.string().optional(),
        receiptNumber: z.string().optional(),
        recipientPhones: z.array(
          z.object(
            {
              phone: z.string().min(6, {
                message: "رقم الهاتف يجب ان يكون 6 ارقام على الأقل",
              }),
              key: z.any(),
            },
            {
              required_error: "مطلوب",
            }
          )
        ),
        notes: z.string().optional(),
        governorate: z.string().optional(),
        details: z.string({
          required_error: "مطلوب",
        }),
        locationID: z.string().min(1, { message: "الرجاء اختيار الموقع" }),
        storeID: z.string(),
      })
      .and(
        z.discriminatedUnion("withProducts", [
          z.object({
            withProducts: z.literal(true),
            products: z
              .array(
                z.object({
                  productID: z
                    .string()
                    .min(1, { message: "الرجاء اختيار المنتج" }),
                  quantity: z
                    .string()
                    .min(1, { message: "الرجاء ادخال الكمية" }),
                  colorID: z
                    .string()
                    .min(1, { message: "الرجاء اختيار اللون" }),
                  sizeID: z
                    .string()
                    .min(1, { message: "الرجاء اختيار المقاس" }),
                })
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
        ])
      )
  ),
  // .superRefine((items, ctx) => {
  //     const uniqueValues = new Map<string, number>();

  //     items.forEach((item, idx) => {
  //         console.log(uniqueValues);
  //         console.log(item);
  //         console.log(idx);
  //         if(item.receiptNumber){
  //             const checkIfExist=items.findIndex(order => order.receiptNumber === item.receiptNumber)
  //             if(checkIfExist)
  //         }
  //         // const firstAppearanceIndex = item.unique ? uniqueValues.get(item.receiptNumber) : undefined;

  //         // if (firstAppearanceIndex !== undefined && firstAppearanceIndex > 0) {
  //         //     ctx.addIssue({
  //         //         code: z.ZodIssueCode.custom,
  //         //         message: "لا يمكن ان يكون القيمة مكررة",
  //         //         path: [idx, "receiptNumber"]
  //         //     });
  //         //     ctx.addIssue({
  //         //         code: z.ZodIssueCode.custom,
  //         //         message: "لا يمكن ان يكون القيمة مكررة",
  //         //         path: [...ctx.path, firstAppearanceIndex, "receiptNumber"]
  //         //     });
  //         //     return;
  //         // }
  //         // uniqueValues.set(item.receiptNumber, idx);
  //     });
  // })
});
