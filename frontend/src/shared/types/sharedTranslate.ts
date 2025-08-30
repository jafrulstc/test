export interface NavigationTranslations {
  sidebar: {
    module: {
      hostel: string;
      education: string;
      accounts: string;
      library: string;
      boarding: string;
    };
    items: {
      // Hostel
      rooms: string;
      students: string;
      guardians: string;
      attendance: string;
      fees: string;
      meals: string;
      notices: string;
      reports: string;
      
      // Education
      dashboard: string;
      education: {
        classes: string;
        subjects: string;
                persons: {
          name: string;
          manage: string;
          form: string;
          report: string;
        };
        students: {
          name: string;
          manage: string;
          form: string;
          report: string;
        };
        teachers: {
          name: string;
          manage: string;
          form: string;
          report: string;
        };
        staffs: {
          name: string;
          manage: string;
          form: string;
          report: string;
        };
        attendance: string;
        exams: string;
        reports: string;
      };
      masterData: string;

      // Accounts
      accounts: {
        dashboard: string;
        fees: string;
        reports: string;
      };
      transactions: string;
      expenses: string;

      // Library
      library: {
        dashboard: string;
        reports: string;
      };
      books: string;
      members: string;
      borrowing: string;

      // Boarding
      boarding: {
        dashboard: string;
        packages: string;
        assign: string;
        meals: string;
        attendance: string;
        billing: string;
        reports: string;
        master_data: string;
      };
    };
  };
}

export interface CommonTranslations {
    save: string,
    create: string,
    update: string,
    cancel: string,
    close: string,
    delete: string,
}