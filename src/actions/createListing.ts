"use server";
import { PrismaClient } from "@prisma/client";
import cloudinary from "@/lib/cloudinary";

const prisma = new PrismaClient();

export default async function createListing(listingData: ListingData) {
  try {
    const { title, description, address, country, dailyRate, images } =
      listingData;
    console.log("Received listing data:", listingData);

    const validImages = (images || []).filter(
      (image) => typeof image === "string"
    );

    // Cloudinary upload
    const uploadResults = await Promise.all(
      validImages.map((image) => cloudinary.uploader.upload(image))
    );

    // Cloudinary image URLs
    const imageUrls = uploadResults.map((result) => result.secure_url);

    const newListing = await prisma.listing.create({
      data: {
        title: title,
        description: description,
        address: address,
        country: country,
        dailyRate: dailyRate,
        images: imageUrls,
        createdById: listingData.createdById,
        bookedDates: [],
      },
    });

    console.log("New listing created:", newListing);
    return newListing;
  } catch (error) {
    console.error("Error creating listing:", error);
    throw new Error("Failed to create listing");
  }
}
