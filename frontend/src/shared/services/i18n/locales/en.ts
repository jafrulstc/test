// en.ts - এভাবে পরিবর্তন করুন
import { Translations } from "~/shared/services/i18n/types/translation";
import { authEn } from "~/features/auth/translate/authEn"
import { commonEn, navigationEn } from "~/shared/translate/navigation/navigationEn"

export const en:Translations = {
  common: commonEn,
  auth: authEn,
  navigation: navigationEn
}