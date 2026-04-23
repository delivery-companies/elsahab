// import { isValidIraqiPhoneNumber } from '@/lib/testIraqiPhoneNumber';
import { z } from "zod";

export const editTenantSchema = z
    .object({
        name: z.string().min(1, { message: "يجب ان يكون اكتر من حرف" }),
        phone: z.string().min(6, { message: "رقم الهاتف يجب ان يكون 6 ارقام على الأقل" }),
        website: z.string().optional(),
        logo: z.any(),
        registrationText: z.string().min(1, { message: "يجب ان يكون اكتر من حرف" }),
        governoratePrice: z.number().min(0, { message: "يجب ان يكون اكتر من حرف" }),
        deliveryAgentFee: z.number().min(0, { message: "يجب ان يكون اكتر من حرف" }),
        baghdadPrice: z.number().min(0, { message: "يجب ان يكون اكثر من 1 حرف" }),
        additionalPriceForEvery500000IraqiDinar: z.number().min(0, { message: "يجب ان يكون اكثر من 1 حرف" }),
        additionalPriceForEveryKilogram: z.number().min(0, { message: "يجب ان يكون اكثر من 1 حرف" }),
        additionalPriceForRemoteAreas: z.number().min(0, { message: "يجب ان يكون اكثر من 1 حرف" }),
        orderStatusAutomaticUpdate: z.boolean(),
        password: z
            .string()
            .refine((password) => !password || password.length >= 6, {
                message: "كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل"
            })
            .optional(),
        confirmPassword: z
            .string()
            .refine((confirmPassword) => !confirmPassword || confirmPassword.length >= 6, {
                message: "كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل"
            })
            .optional()
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
            path: ["confirmPassword"]
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
            path: ["confirmPassword"]
        }
    );
