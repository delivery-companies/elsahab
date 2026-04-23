import { z } from "zod";

export const editLocationSchema = z.object({
  name: z.string().min(3, { message: "الاسم يجب ان يكون اكثر من 3 احرف" }),
  governorate: z.string().min(1, { message: "يجب اختيار المحافظة" }),
  branch: z
    .string({
      invalid_type_error: "يجب اختيار الفرع",
    })
    .min(1, { message: "يجب اختيار الفرع" }),
  deliveryAgentsIDs: z.array(z.string()).optional(),
  remote: z.boolean(),
});
