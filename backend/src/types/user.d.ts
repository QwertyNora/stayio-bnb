import { User } from "@prisma/client";

type UserRegistrationData = Omit<User, "id" | "createdAt" | "updatedAt">;

type UserLoginData = Omit<
  User,
  "createdAt" | "updatedAt" | "email" | "userName"
> & {
  login: string;
};

type UserResetPasswordData = {
  email: string;
  newPassword: string;
  uuid: string;
};
