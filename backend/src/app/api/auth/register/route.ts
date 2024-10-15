import { hashPassword } from "@/utils/bcrypt";
import userValidator from "@/utils/validators/userValidator";
import { PrismaClient, User } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Request body:", body);

    const [hasErrors, errors] = await userValidator(body);
    if (hasErrors) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const hashedPassword = await hashPassword(body.password);

    const user: User = await prisma.user.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        userName: body.userName,
        email: body.email.toLowerCase(),
        password: hashedPassword,
      },
    });
    const userWithoutPassword = {
      ...user,
      password: undefined,
    };
    console.log("Created user (API):", userWithoutPassword);
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error: any) {
    console.warn("Error creating user", error);
    return NextResponse.json(
      {
        message: "A valid 'UserData' object has to be sent",
      },
      { status: 400 }
    );
  }
}

// TODO:
// Ändra username or email i login
// Ta password twice från blogerino och show etc
