// import { isValidIraqiPhoneNumber } from '@/lib/testIraqiPhoneNumber';
import { z } from "zod";

export const createClientAndStoreModalSchema = z
    .object({
        clientName: z.string().min(3, { message: "الاسم يجب ان يكون اكثر من 3 احرف" }),
        phone: z.string().min(6, { message: "رقم الهاتف يجب ان يكون 6 ارقام على الأقل" }),
        branch: z.string().min(1, { message: "الرجاء اختيار الفرع" }),
        avatar: z.any(),
        type: z.string().min(1, { message: "الرجاء اختيار نوع الحساب" }),
        companyID: z.string().min(1, { message: "الرجاء اختيار الشركة" }),
        password: z.string().min(6, { message: "كلمة المرور يجب ان تكون 6 احرف" }),
        confirmPassword: z.string().min(6, { message: "كلمة المرور يجب ان تكون 6 احرف" }),
        storeName: z.string().min(2, { message: "يجب ان يكون اسم المتجر اكثر من 2 احرف" }),
        notes: z.string().optional().nullable(),
        logo: z.any()
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "كلمة المرور غير متطابقة",
        path: ["confirmPassword"]
    });
