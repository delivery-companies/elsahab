import { z } from "zod";

export const addRepositorySchema = z.object({
    name: z.string().min(3, { message: "يجب ان يكون اكثر من 3 احرف" }),
    branch: z
        .string()
        .min(1, { message: "يجب ان تختار فرع" })
        .refine(
            (value) => {
                return value !== "0";
            },
            { message: "يجب ان تختار فرع" }
        ),
    mainRepository:z.boolean().optional(),
    type:z.string().min(1,{message:"يجب اختار نوع المخزن"})
        
});
