import { UserResetPasswordData } from "@/types/user";
import { hashPassword } from "@/utils/bcrypt";
import { userResetPasswordValidator } from "@/utils/validators/userValidator";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body: UserResetPasswordData = await request.json();
    const [hasErrors, errors] = userResetPasswordValidator(body);
    if (hasErrors) {
      return NextResponse.json({ errors }, { status: 400 });
    }
    await prisma.user.update({
      where: {
        email: body.email,
        passwordResetUUID: body.uuid,
      },
      data: {
        password: await hashPassword(body.newPassword),
        passwordResetUUID: null,
      },
    });
    return NextResponse.json({
      message: "New password was set successfully",
    });
  } catch (error: any) {
    console.log("Error: failed to set new password", error.message);
    return NextResponse.json(
      {
        message: "User not found",
      },
      {
        status: 404,
      }
    );
  }
}
