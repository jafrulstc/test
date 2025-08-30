import { t } from "i18next";
import z from "zod";
import { tPath } from "~/shared/utils/translateType";

// i18n-সহ ভ্যালিডেশন স্কিমা
export const loginSchema = z.object({
  username: z
    .string()
    .min(1, t(tPath.auth.login.username.error.required))
    .max(50, t(tPath.auth.login.username.error.max)),
  password: z
    .string()
    .min(1, t(tPath.auth.login.password.error.required)),
  module: z
    .string()
    .min(1, t(tPath.auth.login.module.error.required)),
})