import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "./utils/jwt";

const UNSAFE_METHODS = ["POST", "PUT", "PATCH", "DELETE"];
const PROTECTED_ROUTES = ["/profile", "/api/users/me", "/api/listings/:id*"];

export async function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const path = url.pathname;

  const token = request.cookies.get("token");
  console.log("Cookie token:", token);

  // Kontrollera om förfrågan gäller en skyddad rutt
  if (PROTECTED_ROUTES.includes(path)) {
    try {
      // Hämta JWT från cookies istället för Authorization-header
      const token = request.cookies.get("token");

      if (!token) {
        throw new Error("No token found in cookies");
      }

      const decryptedToken = await verifyJWT(token.value); // Verifiera JWT från cookie

      if (!decryptedToken) {
        throw new Error("Invalid token");
      }

      // Tokenen är giltig, sätt användar-ID i headers
      const headers = new Headers(request.headers);
      headers.set("userId", decryptedToken.userId);

      return NextResponse.next({
        headers,
      });
    } catch (error: any) {
      console.log("Error validating token: ", error.message);
      // Omdirigera till login om tokenen är ogiltig eller saknas
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile", "/api/users/me", "/api/listings", "/api/listings/:id*"],
};

//!Authorization-header:
// import { NextRequest, NextResponse } from "next/server";
// import { verifyJWT } from "./utils/jwt";

// const UNSAFE_METHODS = ["POST", "PUT", "PATCH", "DELETE"];
// const PROTECTED_ROUTES = ["/profile", "/api/users/me", "/api/listings/:id*"];

// export async function middleware(request: NextRequest) {
//   const url = new URL(request.url);
//   const path = url.pathname;

//   if (PROTECTED_ROUTES.includes(path)) {
//     try {
//       const Authorization = request.headers.get("Authorization");

//       if (!Authorization) {
//         throw new Error("No authorization header");
//       }

//       const token = Authorization.split(" ")[1];
//       const decryptedToken = await verifyJWT(token);

//       if (!decryptedToken) {
//         throw new Error("Invalid token");
//       }

//       // Validera tokenen och returnera den om den är giltig
//       const headers = new Headers(request.headers);
//       headers.set("userId", decryptedToken.userId);

//       return NextResponse.next({
//         headers,
//       });
//     } catch (error: any) {
//       console.log("Error validating token: ", error.message);
//       return NextResponse.redirect(new URL("/login", request.url));
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/profile", "/api/users/me", "/api/listings", "/api/listings/:id*"],
// };
