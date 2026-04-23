// import { isValidIraqiPhoneNumber } from '@/lib/testIraqiPhoneNumber';
import * as z from "zod";

export const editOrderSchema = z.object({
  paidAmount: z.string().min(1, { message: "الرجاء ادخال المبلغ المدفوع" }),
  discount: z.string().min(1, { message: "الرجاء ادخال الخصم" }),
  status: z.string().min(1, { message: "الرجاء اختيار حالة الطلب" }),
  deliveryAgentID: z
    .string()
    .min(1, { message: "الرجاء اختيار مندوب التوصيل" })
    .optional(),
  deliveryDate: z.string().optional(),
  recipientName: z.string().min(1, { message: "الرجاء ادخال اسم المستلم" }),
  recipientPhones: z.array(
    z.object(
      {
        number: z
          .string()
          .min(6, { message: "رقم الهاتف يجب ان يكون 6 ارقام على الأقل" }),
        key: z.any(),
      },
      {
        required_error: "مطلوب",
      }
    )
  ),
  recipientAddress: z
    .string()
    .min(1, { message: "الرجاء ادخال عنوان المستلم" }),
  notes: z.string().optional(),
  details: z.string().optional(),
  repositoryID: z.string().optional(),
  branchID: z.string().optional(),
  weight: z.string().optional(),
  quantity: z.string().optional(),
  governorate: z.string().min(1, { message: "الرجاء ادخال المحافظه" }),
  locationID: z.string().min(1, { message: "الرجاء ادخال المنطقه" }),
});
