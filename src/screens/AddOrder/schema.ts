// import { isValidIraqiPhoneNumber } from '@/lib/testIraqiPhoneNumber';
import * as z from "zod";

const bseSchema = z.object({
    recipientName: z.string().min(1, { message: "الرجاء ادخال اسم المستلم" }),
    recipientPhone: z.array(
        z.object(
            {
                number: z.string().min(6, { message: "رقم الهاتف يجب ان يكون 6 ارقام على الأقل" }),
                key: z.any()
            },
            {
                required_error: "مطلوب"
            }
        )
    ),
    recipientAddress: z.string().min(1, { message: "الرجاء ادخال عنوان المستلم" }),
    notes: z.string().optional(),
    details: z.string().optional(),
    deliveryType: z.string().min(1, { message: "الرجاء اختيار نوع التوصيل" }),
    governorate: z.string().min(1, { message: "الرجاء اختيار المحافظة" }),
    locationID: z.string().min(1, { message: "الرجاء اختيار الموقع" }),
    storeID: z.string().min(1, { message: "الرجاء اختيار المتجر" }),
    branchID: z.string().min(1, { message: "الرجاء اختيار الفرع" })
});

export const addOrderSchema = z
    .discriminatedUnion("withProducts", [
        z.object({
            withProducts: z.literal(true),
            products: z
                .array(
                    z.object({
                        productID: z.string().min(1, { message: "الرجاء اختيار المنتج" }),
                        quantity: z.string().min(1, { message: "الرجاء ادخال الكمية" }),
                        colorID: z.string().min(1, { message: "الرجاء اختيار اللون" }),
                        sizeID: z.string().min(1, { message: "الرجاء اختيار المقاس" })
                    })
                )
                .min(1, { message: "الرجاء اختيار المنتجات" })
                .optional()
        }),
        z.object({
            withProducts: z.literal(false),
            totalCost: z.number().min(1, { message: "الرجاء ادخال السعر" }).optional(),
            quantity: z.string().min(1, { message: "الرجاء ادخال الكمية" }).optional(),
        })
    ])
    .and(bseSchema);
