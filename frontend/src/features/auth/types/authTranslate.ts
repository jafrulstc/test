// ~/features/auth/types/authTranslate.ts

export interface AuthLoginTranslations {
  title: string;
  subtitle: string;
  username: {
    label: string;
    placeholder: string;
    error: {
      required: string;
      max: string;
    };
  };
  password: {
    label: string;
    placeholder: string;
    error: {
      required: string;
    };
    toggle: {
      show: string;
      hide: string;
    };
  };
  module: {
    label: string;
    placeholder: string;
    error: {
      required: string;
    };
    options: {
      hostel: string;
      education: string;
      accounts: string;
      library: string;
      boarding: string;
    };
  };
  button: {
    signIn: string;
    signingIn: string;
  };
  errors: {
    loginFailed: string;
    invalid: string;
    noAccess: string;     // ✅ নতুন যোগ
    invalidToken: string; // ✅ নতুন যোগ
    expiredToken: string; // ✅ নতুন যোগ
    noToken: string;      // ✅ নতুন যোগ
    userNotFound: string; // ✅ নতুন যোগ
    currentPasswordIncorrect: string; // ✅ নতুন যোগ
    passwordTooShort: string;         // ✅ নতুন যোগ
  };
}

export interface AuthTranslations {
  login: AuthLoginTranslations;
}
