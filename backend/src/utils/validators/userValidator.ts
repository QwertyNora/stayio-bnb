import { PrismaClient, User } from "@prisma/client";

type ErrorObject = {
  [key: string]: any;
};

const prisma = new PrismaClient();

export default async function userValidator(
  data: UserData,
  id?: string
): Promise<[boolean, ErrorObject]> {
  let errors: ErrorObject = {};
  const { email, firstName, lastName, userName, password } = data;

  if ((data as User).id !== undefined) {
    console.log("user", data, id);
    if ((data as User).id !== id) {
      errors.id = "Id missmatch";
    }
  }

  if (!firstName || firstName.length < 2) {
    errors.firstName = "First name must be at least 2 characters long";
  }
  if (!lastName || lastName.length < 2) {
    errors.author = "Last name must be at least 2 characters long";
  }

  if (!userName || userName.length < 2) {
    errors.userName = "Username must be at least 2 characters long";
  }

  if (!email || !email.includes("@")) {
    errors.email = "Email is required";
  }
  if (!password || password.length < 6) {
    errors.password = "Password must be at least 6 characters long";
  }
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    errors.email = "Email already exists. Please use another email.";
  }

  const hasErrors = Object.keys(errors).length !== 0;

  return [hasErrors, errors];
}
