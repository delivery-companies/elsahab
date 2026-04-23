// import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/lib/consts';
import { z } from "zod";

export const addProductSchema = z
    .object({
        title: z.string().min(3, { message: "اسم المنتج قصير جداً" }),
        price: z.string(),
        image: z.any(),
        // .refine((files) => files?.length === 1, 'الصوره مطلوبة')
        // .refine(
        //   (files) => files?.[0]?.size <= MAX_FILE_SIZE,
        //   'الحد الاقصي 5 ميجا'
        // )
        // .refine(
        //   (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
        //   'يجب ان تكون الصورة من نوع .jpg, .jpeg, .png او .webp'
        // ),
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
        storeID: z.string().min(1, { message: "يجب اختيار المتجر" }),

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
