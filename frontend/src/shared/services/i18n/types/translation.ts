import { AuthTranslations } from "~/features/auth/types/authTranslate";
import { CommonTranslations, NavigationTranslations } from "~/shared/types/sharedTranslate";

export interface Translations {
    common: CommonTranslations;
    auth: AuthTranslations;
    navigation: NavigationTranslations;
}