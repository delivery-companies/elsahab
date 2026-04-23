// import { isValidIraqiPhoneNumber } from '@/lib/testIraqiPhoneNumber';
import { z } from "zod";

export const editClientSchema = z
  .object({
    name: z.string().min(3, { message: "الاسم يجب ان يكون اكثر من 3 احرف" }),
    phone: z
      .string()
      .min(6, { message: "رقم الهاتف يجب ان يكون 6 ارقام على الأقل" }),
    branch: z.string(),
    avatar: z.any(),
    type: z.string().min(1, { message: "الرجاء اختيار نوع الحساب" }),
    companyID: z.string().min(1, { message: "الرجاء اختيار الشركة" }),
    showNumbers: z.boolean().optional(),
    showDeliveryNumber: z.boolean().optional(),
    password: z
      .string()
      .refine((password) => !password || password.length >= 6, {
        message: "كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل",
      })
      .optional(),
    confirmPassword: z
      .string()
      .refine(
        (confirmPassword) => !confirmPassword || confirmPassword.length >= 6,
        {
          message: "كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل",
        }
      )
      .optional(),
  })
  .refine(
    (data) => {
      if (data.password && data.confirmPassword) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: "كلمة المرور غير متطابقة",
      path: ["confirmPassword"],
    }
  )
  .refine(
    (data) => {
      if (data.password && !data.confirmPassword) {
        return false;
      }
      return true;
    },
    {
      message: "كلمة المرور غير متطابقة",
      path: ["confirmPassword"],
    }
  );
