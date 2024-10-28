import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import createListing from "@/actions/createListing";
import listingValidator from "@/utils/validators/listingValidator";
import { verifyJWT } from "@/utils/jwt";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const listings = await prisma.listing.findMany();
    return NextResponse.json(listings, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Request body received in POST /api/listings:", body);

    // Hämta och verifiera token från headern
    const Authorization = request.headers.get("Authorization");
    if (!Authorization) {
      console.log("Authorization header missing");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = Authorization.split(" ")[1];
    const user = await verifyJWT(token); // Validera token och hämta användarinfo
    if (!user) {
      console.log("Invalid JWT token");
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
    console.log("User: ", user);
    console.log("User authenticated with ID:", user.userId);

    // Validera data som skickas i förfrågan
    const [hasErrors, errors] = await listingValidator(body);
    if (hasErrors) {
      console.log("Validation errors:", errors);
      return NextResponse.json({ errors }, { status: 400 });
    }

    // Skapa ny listing
    const newListing = await createListing({
      ...body,
      images: body.images || [], // Om det inte finns några bilder, skicka en tom array
      createdById: user.userId, // Skicka med användarens ID från JWT
    });

    console.log("New listing created:", newListing);
    return NextResponse.json(newListing, { status: 201 });
  } catch (error) {
    console.warn("Error creating listing", error);
    return NextResponse.json(
      {
        message: "Failed to create listing",
      },
      { status: 500 }
    );
  }
}
