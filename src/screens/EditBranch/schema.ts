import { z } from "zod";

export const editBranchSchema = z.object({
  name: z.string().min(3, { message: "يجب ان يكون اكثر من 3 حروف" }),
  location: z.string().min(1, { message: "الرجاء اختيار الموقع" }),
});
