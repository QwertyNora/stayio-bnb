import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import listingValidator from "@/utils/validators/listingValidator";
import { verifyJWT } from "@/utils/jwt";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyJWT(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const listingId = params.id;

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: { amenities: { include: { amenity: true } } },
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const listingId = params.id;
  let body: Partial<ListingData> | null = null;

  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyJWT(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    const existingListing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!existingListing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    if (existingListing.createdById !== decoded.userId) {
      return NextResponse.json(
        { error: "Unauthorized to update this listing" },
        { status: 403 }
      );
    }

    const updatedListing = await prisma.listing.update({
      where: { id: listingId },
      data: {
        title: body.title || undefined,
        description: body.description || undefined,
        address: body.address || undefined,
        country: body.country || undefined,
        dailyRate: body.dailyRate
          ? parseFloat(body.dailyRate.toString())
          : undefined,
      },
    });

    return NextResponse.json(updatedListing, { status: 200 });
  } catch (error: any) {
    console.error("Error updating listing:", error.message);
    return NextResponse.json(
      {
        message: error.message || "Failed to update listing",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const listingId = params.id;

  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyJWT(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existingListing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!existingListing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    if (existingListing.createdById !== decoded.userId) {
      return NextResponse.json(
        { error: "Unauthorized to delete this listing" },
        { status: 403 }
      );
    }

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
        message: "Failed to delete listing",
      },
      { status: 500 }
    );
  }
}

//! OLD:
// import { NextRequest, NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";
// import listingValidator from "@/utils/validators/listingValidator";

// const prisma = new PrismaClient();

// export async function GET(request: NextRequest, options: APIOptions) {
//   try {
//     const listingId = options.params.id;

//     const listing = await prisma.listing.findUnique({
//       where: { id: listingId },
//     });

//     if (!listing) {
//       return NextResponse.json({ error: "Listing not found" }, { status: 404 });
//     }

//     return NextResponse.json(listing, { status: 200 });
//   } catch (error: any) {
//     console.error("Error fetching listing:", error);
//     return NextResponse.json(
//       { error: "Something went wrong" },
//       { status: 500 }
//     );
//   }
// }

// export async function PUT(request: NextRequest, options: APIOptions) {
//   const listingId = options.params.id;
//   let body: Partial<ListingData> | null = null;

//   try {
//     body = await request.json();
//     console.log("Request body:", body);
//     console.log("Updating listing with ID:", listingId);

//     if (!body || Object.keys(body).length === 0) {
//       throw new Error("Invalid body");
//     }

//     const [hasErrors, errors] = await listingValidator(body, listingId);
//     if (hasErrors) {
//       return NextResponse.json({ errors }, { status: 400 });
//     }
//   } catch (error: any) {
//     return NextResponse.json(
//       {
//         message: "A valid 'ListingData' object has to be sent",
//       },
//       { status: 400 }
//     );
//   }

//   try {
//     const updatedListing = await prisma.listing.update({
//       where: { id: listingId },
//       data: {
//         ...body,
//       },
//     });

//     return NextResponse.json(updatedListing, { status: 200 });
//   } catch (error: any) {
//     console.error("Error updating listing:", error.message);
//     return NextResponse.json(
//       {
//         message: "Listing not found",
//       },
//       { status: 404 }
//     );
//   }
// }

// export async function DELETE(request: NextRequest, options: APIOptions) {
//   const listingId = options.params.id;

//   try {
//     const deletedListing = await prisma.listing.delete({
//       where: { id: listingId },
//     });

//     return NextResponse.json(
//       { message: "Listing deleted successfully" },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     console.error("Error deleting listing:", error.message);
//     return NextResponse.json(
//       {
//         message: "Listing not found",
//       },
//       { status: 404 }
//     );
//   }
// }
