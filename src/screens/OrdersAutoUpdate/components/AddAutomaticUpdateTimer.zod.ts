import { z } from "zod";

export const orderStatusAutomaticUpdateCreateSchema = z.object({
  orderStatus: z
    .string({
      required_error: "يجب ادخال حالة الطلب",
    })
    .nonempty({
      message: "يجب ادخال حالة الطلب",
    }),
  newOrderStatus: z
    .string({
      required_error: "يجب ادخال حالة الطلب",
    })
    .nonempty({
      message: "يجب ادخال حالة الطلب",
    }),
  checkAfter: z.number().optional(),
  updateAt: z.number().optional(),
  enabled: z.boolean().optional(),
  returnCondition: z.string().optional(),
  notes: z.string().optional(),
});
