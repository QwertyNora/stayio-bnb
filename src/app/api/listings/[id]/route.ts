import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import listingValidator from "@/utils/validators/listingValidator";
import { verifyJWT } from "@/utils/jwt";
import cloudinary from "@/lib/cloudinary";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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
    if (!body) {
      throw new Error("Request body is null");
    }
    console.log("Request body:", body);

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

    const newImages = body.newImages || [];
    const uploadedImages = await Promise.all(
      newImages.map((image: string) => cloudinary.uploader.upload(image))
    );
    const newImageUrls = uploadedImages.map((upload) => upload.secure_url);

    const removedImages = body.removedImages || [];
    await Promise.all(
      removedImages.map((url: string) => {
        const publicId = url.split("/").pop()?.split(".")[0];
        return cloudinary.uploader.destroy(publicId!);
      })
    );

    const updatedImages = [
      ...(existingListing.images || []).filter(
        (img) => !removedImages.includes(img)
      ),
      ...newImageUrls,
    ];

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
        images: updatedImages,
      },
    });

    return NextResponse.json(updatedListing, { status: 200 });
  } catch (error: any) {
    console.error("Error updating listing:", error.message);
    return NextResponse.json(
      { message: error.message || "Failed to update listing" },
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
