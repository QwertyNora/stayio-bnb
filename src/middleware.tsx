import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "./utils/jwt";

const PROTECTED_ROUTES = [
  "/api/users/me",
  "/api/admin/bookings",
  "/api/admin/:path*",
  "/api/admin/listings",
];

const PROTECTED_METHODS = ["POST", "PUT", "PATCH", "DELETE"];

export async function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const path = url.pathname;
  console.log("middleware URL: ", url);

  if (
    PROTECTED_METHODS.includes(request.method) ||
    PROTECTED_ROUTES.some(
      (route) => path.startsWith(route) || path.match(route)
    )
  ) {
    try {
      const token = request.headers.get("Authorization")?.split(" ")[1];

      if (!token) {
        throw new Error("No token found");
      }

      const decodedToken = await verifyJWT(token);
      console.log("Decoded token: ", decodedToken);

      if (!decodedToken) {
        throw new Error("Invalid token");
      }

      // Check if the route is an admin route and the user is an admin
      // if (
      //   (path.startsWith("/api/admin") || path === "/admin") &&
      //   !decodedToken.isAdmin
      // ) {
      //   throw new Error("User is not an admin");
      // }

      // Set both userId and Authorization header
      const headers = new Headers(request.headers);
      headers.set("userId", decodedToken.userId);
      headers.set("Authorization", `Bearer ${token}`);

      console.log("Headers: ", headers);
      return NextResponse.next({
        headers: headers,
      });
    } catch (error: any) {
      console.log("Error validating token: ", error.message);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  console.log("safe", path);
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile",
    "/api/users/me",
    "/api/listings/:path*",
    "/api/bookings/:path*",
    "/api/admin/:path*",
  ],
};
