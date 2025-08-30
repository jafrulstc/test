// ~/features/auth/translations/authBn.ts

import { AuthLoginTranslations, AuthTranslations } from "~/features/auth/types/authTranslate";

const login: AuthLoginTranslations = {
  title: "আবার স্বাগতম",
  subtitle: "আপনার অ্যাকাউন্টে সাইন ইন করুন",
  username: {
    label: "ব্যবহারকারী নাম",
    placeholder: "আপনার ব্যবহারকারী নাম লিখুন",
    error: {
      required: "ব্যবহারকারী নাম আবশ্যক",
      max: "ব্যবহারকারী নাম অবশ্যই ৫০ অক্ষরের কম হতে হবে",
    },
  },
  password: {
    label: "পাসওয়ার্ড",
    placeholder: "আপনার পাসওয়ার্ড লিখুন",
    error: {
      required: "পাসওয়ার্ড আবশ্যক",
    },
    toggle: {
      show: "পাসওয়ার্ড দেখান",
      hide: "পাসওয়ার্ড লুকান",
    },
  },
  module: {
    label: "মডিউল",
    placeholder: "মডিউল নির্বাচন করুন",
    error: {
      required: "মডিউল নির্বাচন করা আবশ্যক",
    },
    options: {
      hostel: "হোস্টেল",
      education: "শিক্ষা",
      accounts: "হিসাব",
      library: "লাইব্রেরি",
      boarding: "বোর্ডিং",
    },
  },
  button: {
    signIn: "সাইন ইন",
    signingIn: "সাইন ইন হচ্ছে...",
  },
  errors: {
    loginFailed: "লগইন ব্যর্থ হয়েছে",
    invalid: "অকার্যকর ব্যবহারকারী নাম বা পাসওয়ার্ড",
    noAccess: "আপনার এই মডিউলে প্রবেশাধিকার নেই",
    invalidToken: "অকার্যকর টোকেন ফরম্যাট",
    expiredToken: "টোকেনটি অকার্যকর বা মেয়াদোত্তীর্ণ",
    noToken: "কোনো প্রমাণীকরণ টোকেন পাওয়া যায়নি",
    userNotFound: "ব্যবহারকারী খুঁজে পাওয়া যায়নি",
    currentPasswordIncorrect: "বর্তমান পাসওয়ার্ড সঠিক নয়",
    passwordTooShort: "নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"
  },
};

export const authBn: AuthTranslations = {
  login,
};
