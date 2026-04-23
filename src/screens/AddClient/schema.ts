// import { isValidIraqiPhoneNumber } from '@/lib/testIraqiPhoneNumber';
import { z } from "zod";

export const addClientSchema = z
  .object({
    name: z.string().min(3, { message: "الاسم يجب ان يكون اكثر من 3 احرف" }),
    phone: z
      .string()
      .min(6, { message: "رقم الهاتف يجب ان يكون 6 ارقام على الأقل" }),
    branch: z.string(),
    avatar: z.any(),
    type: z.string().optional(),
    companyID: z.string().min(1, { message: "الرجاء اختيار الشركة" }),
    password: z.string().min(6, { message: "كلمة المرور يجب ان تكون 6 احرف" }),
    confirmPassword: z
      .string()
      .min(6, { message: "كلمة المرور يجب ان تكون 6 احرف" }),
    showNumbers: z.boolean().optional(),
    isExternal: z.boolean().optional(),
    showDeliveryNumber: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمة المرور غير متطابقة",
    path: ["confirmPassword"],
  });
