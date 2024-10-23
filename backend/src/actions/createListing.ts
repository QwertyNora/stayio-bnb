"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function createListing(listingData: ListingData) {
  try {
    const { title, description, address, country, dailyRate } = listingData;
    console.log("Received listing data:", listingData);

    const newListing = await prisma.listing.create({
      data: {
        title: title,
        description: description,
        address: address,
        country: country,
        dailyRate: dailyRate,
        createdById: listingData.createdById, // Associera med användarens ID
        bookedDates: [], // Initiera som en tom array
      },
    });

    console.log("New listing created:", newListing);
    return newListing;
  } catch (error) {
    console.error("Error creating listing:", error);
    throw new Error("Failed to create listing");
  }
}
