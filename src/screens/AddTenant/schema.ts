// import { isValidIraqiPhoneNumber } from '@/lib/testIraqiPhoneNumber';
import { z } from "zod";

export const addTenantSchema = z
    .object({
        name: z.string().min(1, { message: "يجب ان يكون اكتر من حرف" }),
        phone: z.string().min(6, { message: "رقم الهاتف يجب ان يكون 6 ارقام على الأقل" }),
        website: z.string().optional(),
        registrationText: z.string().min(1, { message: "يجب ان يكون اكتر من حرف" }),
        logo: z.any(),
        governoratePrice: z.string().min(0, { message: "يجب ان يكون اكتر من حرف" }),
        deliveryAgentFee: z.string().min(0, { message: "يجب ان يكون اكتر من حرف" }),
        baghdadPrice: z.string().min(0, { message: "يجب ان يكون اكثر من 1 حرف" }),
        additionalPriceForEvery500000IraqiDinar: z.string().min(0, { message: "يجب ان يكون اكثر من 1 حرف" }),
        additionalPriceForEveryKilogram: z.string().min(0, { message: "يجب ان يكون اكثر من 1 حرف" }),
        additionalPriceForRemoteAreas: z.string().min(0, { message: "يجب ان يكون اكثر من 1 حرف" }),
        orderStatusAutomaticUpdate: z.boolean(),
        password: z.string().min(6, { message: "كلمة المرور يجب ان تكون 6 احرف" }),
        confirmPassword: z.string().min(6, { message: "كلمة المرور يجب ان تكون 6 احرف" })
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "كلمة المرور غير متطابقة",
        path: ["confirmPassword"]
    });
