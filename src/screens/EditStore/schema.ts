import { z } from "zod";

export const editProductSchema = z.object({
    name: z
        .string({
            invalid_type_error: "يجب ان يكون اسم المنتج نص",
            required_error: "يجب ادخال اسم المنتج"
        })
        .min(2, { message: "يجب ان يكون اسم المتجر اكثر من 2 احرف" }),
    client: z
        .string({
            invalid_type_error: "يجب ان يكون العميل نص",
            required_error: "يجب اختيار العميل"
        })
        .min(1, { message: "يجب اختيار العميل" }),
    notes: z.string(),
    logo: z.any()
});
