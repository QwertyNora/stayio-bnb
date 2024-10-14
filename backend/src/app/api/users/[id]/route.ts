import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import userValidator from "@/utils/validators/userValidator";
import { UserRegistrationData } from "@/types/user";

const prisma = new PrismaClient();

export async function GET(request: NextRequest, options: APIOptions) {
  try {
    const userId = options.params.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, options: APIOptions) {
  const id = options.params.id;
  let body: Partial<UserRegistrationData> | null = null;

  try {
    body = await request.json();
    console.log("Request body:", body);
    console.log("Updating user with ID:", id);

    if (!body || Object.keys(body).length === 0) {
      throw new Error("Invalid body");
    }

    const [hasErrors, errors] = await userValidator(body, id);
    if (hasErrors) {
      return NextResponse.json({ errors }, { status: 400 });
    }
  } catch (error: any) {
    console.log("Options:", options);
    console.log("User ID:", id);
    console.warn("Error validating user: ", error.message);

    return NextResponse.json(
      {
        message: "A valid 'User' object has to be sent",
      },
      { status: 400 }
    );
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: {
        ...body,
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error: any) {
    console.error("Error updating user:", error.message);
    return NextResponse.json(
      {
        message: "User not found",
      },
      { status: 404 }
    );
  }
}

export async function DELETE(request: NextRequest, options: APIOptions) {
  try {
    const userId = options.params.id;

    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting user:", error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
