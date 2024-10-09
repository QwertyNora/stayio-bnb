import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import listingValidator from "@/utils/validators/listingValidator";

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

    const [hasErrors, errors] = await listingValidator(body);
    if (hasErrors) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const newListing = await prisma.listing.create({
      data: {
        ...body,
        // createdById: user.id,  // Dynamiskt hämta användarens ID (från JWT eller session)
      },
    });

    return NextResponse.json(newListing, { status: 201 });
  } catch (error: any) {
    console.warn("Error creating listing", error);
    return NextResponse.json(
      {
        message: "A valid 'ListingData' object has to be sent",
      },
      { status: 400 }
    );
  }
}
