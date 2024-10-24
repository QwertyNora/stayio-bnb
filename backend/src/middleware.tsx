import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "./utils/jwt";

const PROTECTED_ROUTES = [
  "/api/users/me",
  "/api/listings/:id*",
  "/api/bookings/:id*",
];

export async function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const path = url.pathname;

  // Check if the request is for a protected route
  if (
    PROTECTED_ROUTES.some(
      (route) => path.startsWith(route) || path.match(route)
    )
  ) {
    try {
      const Authorization = request.headers.get("Authorization");

      if (!Authorization) {
        throw new Error("No authorization header");
      }

      const token = Authorization.split(" ")[1];
      const decodedToken = await verifyJWT(token);

      if (!decodedToken) {
        throw new Error("Invalid token");
      }

      // Token is valid, set user ID in headers
      const headers = new Headers(request.headers);
      headers.set("userId", decodedToken.userId);

      return NextResponse.next({
        request: {
          headers: headers,
        },
      });
    } catch (error: any) {
      console.log("Error validating token: ", error.message);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile",
    "/api/users/me",
    "/api/listings/:path*",
    "/api/bookings/:path*",
  ],
};
