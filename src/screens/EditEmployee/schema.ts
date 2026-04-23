// import { isValidIraqiPhoneNumber } from '@/lib/testIraqiPhoneNumber';
import { z } from "zod";

export const editClientAssistantSchema = z
  .object({
    name: z.string().min(3, { message: "الاسم يجب ان يكون اكثر من 3 احرف" }),
    clientAssistantRole: z
      .string()
      .min(3, { message: "الدور يجب ان يكون اكثر من 3 احرف" }),
    phone: z
      .string()
      .min(6, { message: "رقم الهاتف يجب ان يكون 6 ارقام على الأقل" }),
    avatar: z.any(),
    idCard: z.any(),
    residencyCard: z.any(),
    branch: z.any(),
    companyID: z.string().optional(),
    store: z.string().optional(),
    roles: z
      .string()

      .optional(),
    permissions: z.array(
      z.string({ required_error: "الرجاء اختيار الصلاحيات" })
    ),
    orderStatus: z.array(z.string({ required_error: "الرجاء اختيار الحالات" })),
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
export const editEmployeeSchema = z
  .object({
    name: z.string().min(3, { message: "الاسم يجب ان يكون اكثر من 3 احرف" }),
    clientAssistantRole: z.string().optional(),
    phone: z
      .string()
      .min(6, { message: "رقم الهاتف يجب ان يكون 6 ارقام على الأقل" }),
    username: z
      .string()
      .min(6, { message: "اسم المستخدم يجب ان يكون 6 ارقام على الأقل" })
      .regex(/^[^\s&%$()/|\\]+$/, {
        message:
          "اسم المستخدم لا يجب أن يحتوي على مسافات أو رموز خاصة مثل &%$()/|\\",
      }),
    companyID: z.string().min(1, { message: "الرجاء اختيار الشركة" }),
    avatar: z.any(),
    idCard: z.array(z.any()).min(1, { message: "الهوية مطلوبة" }),
    residencyCard: z.array(z.any()).min(1, { message: "الإقامة مطلوبة" }),
    branch: z.string().optional(),
    repository: z.string().optional(),
    role: z
      .string({
        required_error: "الرجاء اختيار الادوار",
      })

      .min(1, { message: "الرجاء اختيار الادوار" }),
    permissions: z.array(
      z.string({
        required_error: "الرجاء اختيار الصلاحيات",
      })
    ),
    orderStatus: z.array(
      z.string({
        required_error: "الرجاء اختيار الحالات",
      })
    ),
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
