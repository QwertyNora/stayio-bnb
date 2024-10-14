import { NextRequest, NextResponse } from "next/server";

import { User, PrismaClient } from "@prisma/client";
import userValidator from "@/utils/validators/userValidator";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const users = await prisma.user.findMany();

    return NextResponse.json(users, { status: 200 });
  } catch (error: any) {
    console.warn("Error fetching users", error.message);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Request body:", body);

    const [hasErrors, errors] = await userValidator(body);
    if (hasErrors) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const newUser = await prisma.user.create({
      data: body,
    });
    return NextResponse.json(newUser, { status: 201 });
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
