import { CommonTranslations, NavigationTranslations } from "~/shared/types/sharedTranslate";

const navigation: NavigationTranslations = {
  sidebar: {
    module: {
      hostel: "Hostel Management",
      education: "Education System",
      accounts: "Accounts Management",
      library: "Library System",
      boarding: "Boarding Management",
    },
    items: {
      // Hostel
      rooms: "Rooms",
      students: "Students",
      guardians: "Guardians",
      attendance: "Attendance",
      fees: "Fees",
      meals: "Meals",
      notices: "Notices",
      reports: "Reports",

      // Education
      dashboard: "Dashboard",
      education: {
        classes: "Classes",
        subjects: "Subjects",
        persons: {
          name: "Persons",
          manage: "Manage",
          form: "Form",
          report: "Report",
        },
        students: {
          name: "Students",
          manage: "Manage",
          form: "Form",
          report: "Report",
        },
        teachers: {
          name: "Teachers",
          manage: "Manage",
          form: "Form",
          report: "Report",
        },
        staffs: {
          name: "Staffs",
          manage: "Manage",
          form: "Form",
          report: "Report",
        },
        attendance: "Attendance",
        exams: "Exams",
        reports: "Reports",
      },
      masterData: "Master Data",

      // Accounts
      accounts: {
        dashboard: "Dashboard",
        fees: "Fees",
        reports: "Reports",
      },
      transactions: "Transactions",
      expenses: "Expenses",

      // Library
      library: {
        dashboard: "Dashboard",
        reports: "Reports",
      },
      books: "Books",
      members: "Members",
      borrowing: "Borrowing",

      // Boarding
      boarding: {
        dashboard: "Dashboard",
        packages: "Packages",
        assign: "Assign",
        meals: "Meals",
        attendance: "Attendance",
        billing: "Billing",
        reports: "Reports",
        master_data: "Master Data",
      },
    },
  },
};

export const commonEn: CommonTranslations = {
    save: "Save",
    create: "Create",
    update: "Update",
    cancel: "Cancel",
    close: "Close",
    delete: "Delete"
}
export const navigationEn: NavigationTranslations = navigation;