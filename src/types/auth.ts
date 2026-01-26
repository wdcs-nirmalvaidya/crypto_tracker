// AUTH & USER TYPES

export interface SignupUser {
  username: string;
  email: string;
  password: string;
}

export interface SignupForm {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}


export type Theme = "dark" | "light";
