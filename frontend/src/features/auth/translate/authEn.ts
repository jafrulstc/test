// ~/features/auth/translations/authEn.ts

import { AuthLoginTranslations, AuthTranslations } from "~/features/auth/types/authTranslate";

const login: AuthLoginTranslations = {
  title: "Welcome Back",
  subtitle: "Sign in to your account",
  username: {
    label: "Username",
    placeholder: "Enter your username",
    error: {
      required: "Username is required",
      max: "Username must be less than 50 characters",
    },
  },
  password: {
    label: "Password",
    placeholder: "Enter your password",
    error: {
      required: "Password is required",
    },
    toggle: {
      show: "Show password",
      hide: "Hide password",
    },
  },
  module: {
    label: "Module",
    placeholder: "Select module",
    error: {
      required: "Module selection is required",
    },
    options: {
      hostel: "Hostel",
      education: "Education",
      accounts: "Accounts",
      library: "Library",
      boarding: "Boarding",
    },
  },
  button: {
    signIn: "Sign In",
    signingIn: "Signing in...",
  },
  errors: {
    loginFailed: "Login failed",
    invalid: "Invalid username or password",
    noAccess: "You do not have access to this module",
    invalidToken: "Invalid token format",
    expiredToken: "Invalid or expired token",
    noToken: "No authentication token found",
    userNotFound: "User not found",
    currentPasswordIncorrect: "Current password is incorrect",
    passwordTooShort: "New password must be at least 6 characters long"
  },
};

export const authEn: AuthTranslations = {
  login,
};
