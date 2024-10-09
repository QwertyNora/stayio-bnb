import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import listingValidator from "@/utils/validators/listingValidator";

const prisma = new PrismaClient();

export async function GET(request: NextRequest, options: APIOptions) {
  try {
    const listingId = options.params.id;

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    return NextResponse.json(listing, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching listing:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, options: APIOptions) {
  const listingId = options.params.id;
  let body: Partial<ListingData> | null = null;

  try {
    body = await request.json();
    console.log("Request body:", body);
    console.log("Updating listing with ID:", listingId);

    if (!body || Object.keys(body).length === 0) {
      throw new Error("Invalid body");
    }

    const [hasErrors, errors] = await listingValidator(body, listingId);
    if (hasErrors) {
      return NextResponse.json({ errors }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "A valid 'ListingData' object has to be sent",
      },
      { status: 400 }
    );
  }

  try {
    const updatedListing = await prisma.listing.update({
      where: { id: listingId },
      data: {
        ...body,
      },
    });

    return NextResponse.json(updatedListing, { status: 200 });
  } catch (error: any) {
    console.error("Error updating listing:", error.message);
    return NextResponse.json(
      {
        message: "Listing not found",
      },
      { status: 404 }
    );
  }
}

export async function DELETE(request: NextRequest, options: APIOptions) {
  const listingId = options.params.id;

  try {
    const deletedListing = await prisma.listing.delete({
      where: { id: listingId },
    });

    return NextResponse.json(
      { message: "Listing deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting listing:", error.message);
    return NextResponse.json(
      {
        message: "Listing not found",
      },
      { status: 404 }
    );
  }
}
