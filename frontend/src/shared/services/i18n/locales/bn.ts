import { authBn } from "~/features/auth/translate/authBn";
import { commonBn, navigationBn } from "~/shared/translate/navigation/navigationBn";
import { Translations } from "~/shared/services/i18n/types/translation";

export const bn:Translations = {
  common: commonBn,
  auth: authBn,
  navigation: navigationBn
} satisfies Translations;