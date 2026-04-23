import * as zod from "zod";

export const BannerSchema = zod.object({
  title: zod
    .string({
      required_error: "مطلوب",
    })
    .optional(),
  content: zod
    .string({
      required_error: "مطلوب",
    })
    .optional(),
  image: zod.any(),
  url: zod
    .string({
      required_error: "مطلوب",
    })
    .optional(),
});
