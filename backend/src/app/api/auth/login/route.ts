import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { UserLoginData } from "@/types/user";
import { comparePassword } from "@/utils/bcrypt";
import { signJWT } from "@/utils/jwt";
import { Familjen_Grotesk } from "next/font/google";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body: UserLoginData = await request.json();
    const { emailOrUserName, password } = body;

    if (!emailOrUserName || !password) {
      return NextResponse.json(
        { error: "Login (username or email) and password are required" },
        { status: 400 }
      );
    }

    const isEmail = emailOrUserName.includes("@");

    const user = await prisma.user.findFirst({
      where: isEmail
        ? { email: emailOrUserName }
        : { userName: emailOrUserName },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User matching credentials not found" },
        { status: 400 }
      );
    }

    const passwordIsSame = await comparePassword(body.password, user.password);
    if (!passwordIsSame) {
      return NextResponse.json({ error: "Password mismatch" }, { status: 400 });
    }

    // Skapa JWT-token
    const token = await signJWT({
      userId: user.id,
    });

    // Skicka svaret med cookie
    const response = NextResponse.json({
      message: "Login successful",
    });

    // Sätt JWT i httpOnly cookie
    response.cookies.set("token", token, {
      httpOnly: true, // Gör cookien oåtkomlig från JavaScript för säkerhet
      secure: false,
      // secure: process.env.NODE_ENV === "production", // Endast säkra cookies i produktion
      sameSite: "lax", // strict, lax, none
      path: "/", // Gör cookien tillgänglig över hela webbplatsen
      maxAge: 60 * 60 * 24 * 7, // Token giltig i 7 dagar
    });

    console.log("Cookie set with token:", token);

    return response;
  } catch (error: any) {
    console.log("Error: failed to login", error.message);
    return NextResponse.json(
      {
        message: "user matching credentials not found",
      },
      { status: 400 }
    );
  }
}

//! Headers:
// import { NextRequest, NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";
// import { UserLoginData } from "@/types/user";
// import { comparePassword } from "@/utils/bcrypt";
// import { signJWT } from "@/utils/jwt";

// const prisma = new PrismaClient();

// export async function POST(request: NextRequest) {
//   try {
//     const body: UserLoginData = await request.json();
//     const { emailOrUserName, password } = body;

//     if (!emailOrUserName || !password) {
//       return NextResponse.json(
//         { error: "Login (username or email) and password are required" },
//         { status: 400 }
//       );
//     }

//     const isEmail = emailOrUserName.includes("@");

//     const user = await prisma.user.findFirst({
//       where: isEmail
//         ? { email: emailOrUserName }
//         : { userName: emailOrUserName },
//     });

//     if (!user) {
//       return NextResponse.json(
//         { error: "User matching credentials not found" },
//         { status: 400 }
//       );
//     }

//     const passwordIsSame = await comparePassword(body.password, user.password);
//     if (!passwordIsSame) {
//       throw new Error("Password missmatch");
//     }

//     const token = await signJWT({
//       userId: user.id,
//     });

//     return NextResponse.json({
//       token: token,
//     });
//   } catch (error: any) {
//     console.log("Error: failed to login", error.message);
//     return NextResponse.json(
//       {
//         message: "user matching credentials not found",
//       },
//       { status: 400 }
//     );
//   }
// }
