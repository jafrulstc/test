import { CommonTranslations, NavigationTranslations } from "~/shared/types/sharedTranslate";


const navigation: NavigationTranslations = {
  sidebar: {
    module: {
      hostel: "হোস্টেল ম্যানেজমেন্ট",
      education: "শিক্ষা সিস্টেম",
      accounts: "অ্যাকাউন্টস ম্যানেজমেন্ট",
      library: "লাইব্রেরি সিস্টেম",
      boarding: "বোর্ডিং ম্যানেজমেন্ট",
    },
    items: {
      // Hostel
      rooms: "রুম",
      students: "শিক্ষার্থী",
      guardians: "অভিভাবক",
      attendance: "উপস্থিতি",
      fees: "ফি",
      meals: "খাবার",
      notices: "নোটিশ",
      reports: "রিপোর্ট",

      // Education
      dashboard: "ড্যাশবোর্ড",
      education: {
        classes: "ক্লাস",
        subjects: "বিষয়",
        persons: {
          name: "ব্যক্তি",
          manage: "ম্যানেজ",
          form: "ফর্ম",
          report: "রিপোর্ট",
        },
        students: {
          name: "শিক্ষার্থী",
          manage: "ম্যানেজ",
          form: "ফর্ম",
          report: "রিপোর্ট",
        },
        teachers: {
          name: "শিক্ষক",
          manage: "ম্যানেজ",
          form: "ফর্ম",
          report: "রিপোর্ট",
        },
        staffs: {
          name: "স্টাফ",
          manage: "ম্যানেজ",
          form: "ফর্ম",
          report: "রিপোর্ট",
        },
        attendance: "উপস্থিতি",
        exams: "পরীক্ষা",
        reports: "রিপোর্ট",
      },
      masterData: "মাস্টার ডাটা",

      // Accounts
      accounts: {
        dashboard: "ড্যাশবোর্ড",
        fees: "ফি",
        reports: "রিপোর্ট",
      },
      transactions: "লেনদেন",
      expenses: "ব্যয়",

      // Library
      library: {
        dashboard: "ড্যাশবোর্ড",
        reports: "রিপোর্ট",
      },
      books: "বই",
      members: "সদস্য",
      borrowing: "ধার",

      // Boarding
      boarding: {
        dashboard: "ড্যাশবোর্ড",
        packages: "প্যাকেজ",
        assign: "অ্যাসাইন",
        meals: "খাবার",
        attendance: "উপস্থিতি",
        billing: "বিলিং",
        reports: "রিপোর্ট",
        master_data: "মাস্টার ডাটা",
      },
    },
  },
};

export const commonBn: CommonTranslations = {
    save: "সংরক্ষণ",
    create: "তৈরি করুন",
    update: "পরিবর্তন করুন",
    cancel: "বাতিল করুন",
    close: "বন্ধ করুন",
    delete: "মুছে দিন"
}

export const navigationBn: NavigationTranslations = navigation;