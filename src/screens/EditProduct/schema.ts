import { z } from "zod";

export const editProductSchema = z
    .object({
        title: z.string().min(3, { message: "اسم المنتج قصير جداً" }),
        price: z.number(),
        image: z.any(),
        stock: z.string(),
        categoryID: z.string().min(1, { message: "يجب اختيار القسم" }),
        colors: z
            .array(
                z.object({
                    label: z.string(),
                    value: z.string(),
                    quantity: z.string()
                })
            )
            .min(1, { message: "يجب اختيار لون واحد على الاقل" }),
        sizes: z
            .array(
                z.object({
                    label: z.string(),
                    value: z.string(),
                    quantity: z.string()
                })
            )
            .min(1, { message: "يجب اختيار مقاس واحد على الاقل" })
    })
    .refine((data) => {
        if (data.colors.length < 1) {
            return false;
        }
        if (data.sizes.length < 1) {
            return false;
        }
        return true;
    });
