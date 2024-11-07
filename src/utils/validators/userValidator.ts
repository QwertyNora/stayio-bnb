import {
  UserLoginData,
  UserRegistrationData,
  UserResetPasswordData,
} from "@/types/user";
import { PrismaClient, User } from "@prisma/client";

type ErrorObject = {
  [key: string]: any;
};

type PartialUserData = Partial<UserRegistrationData>;

const prisma = new PrismaClient();

export default async function userValidator(
  data: PartialUserData,
  id?: string
): Promise<[boolean, ErrorObject]> {
  let errors: ErrorObject = {};
  const { email, firstName, lastName, userName, password } = data;

  if (id && (data as User).id && (data as User).id !== id) {
    errors.id = "Id mismatch";
  }

  if (firstName && firstName.length < 2) {
    errors.firstName = "First name must be at least 2 characters long";
  }

  if (lastName && lastName.length < 2) {
    errors.lastName = "Last name must be at least 2 characters long";
  }

  if (userName && userName.length < 2) {
    errors.userName = "Username must be at least 2 characters long";
  }

  if (email && !email.includes("@")) {
    errors.email = "Email must be valid";
  }

  if (password && password.length < 6) {
    errors.password = "Password must be at least 6 characters long";
  }

  if (email) {
    const existingUser = await prisma.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      errors.email = "Email already exists. Please use another email.";
    }
  }

  const hasErrors = Object.keys(errors).length !== 0;

  return [hasErrors, errors];
}

export function userLoginValidator(
  data: UserLoginData
): [boolean, ErrorObject] {
  let errors: ErrorObject = {};
  if (!data.login) {
    errors.title = "Email or username is required";
    //TODO: Add email validation
  }
  if (!data.password) {
    errors.author = "Password is required";
  }
  const hasErrors = Object.keys(errors).length !== 0;

  return [hasErrors, errors];
}

export function userResetPasswordValidator(
  data: UserResetPasswordData
): [boolean, ErrorObject] {
  let errors: ErrorObject = {};
  if (!data.email) {
    errors.email = "Email is required";
    //TODO: Add email validation
  }
  if (!data.newPassword) {
    errors.newPassword = "Password is required";
  }
  if (!data.uuid) {
    errors.uuid = "UUID missing or incorrect";
  }
  const hasErrors = Object.keys(errors).length !== 0;

  return [hasErrors, errors];
}
