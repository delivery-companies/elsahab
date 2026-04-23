import { z } from "zod";

export const editRepositorySchema = z.object({
    name: z.string().min(3, { message: "يجب ان يكون اكثر من 3 حروف" }),
    branch: z.string().min(1, { message: "الرجاء اختيار الموقع" }),
    mainRepository:z.boolean().optional(),
    type:z.string().min(1,{message:"يجب اختار نوع المخزن"})
});
