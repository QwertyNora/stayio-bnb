import { PrismaClient, Listing } from "@prisma/client";

type ErrorObject = {
  [key: string]: any;
};

type PartialListingData = Partial<ListingData>;

const prisma = new PrismaClient();

export default async function listingValidator(
  data: PartialListingData,
  id?: string
): Promise<[boolean, ErrorObject]> {
  let errors: ErrorObject = {};
  const { title, description, address, country, dailyRate } = data;

  console.log("Validating listing data:", data); // Logga data som valideras

  if (!title) {
    errors.title = "Title is required";
    console.log("Validation failed for title: Missing"); // Logga vid valideringsfel
  } else if (title.length < 3) {
    errors.title = "Title must be at least 3 characters long";
    console.log("Validation failed for title: Too short"); // Logga vid fel
  }

  if (!description) {
    errors.description = "Description is required";
    console.log("Validation failed for description: Missing"); // Logga vid fel
  } else if (description.length < 10) {
    errors.description = "Description must be at least 10 characters long";
    console.log("Validation failed for description: Too short"); // Logga vid fel
  }

  if (!address) {
    errors.address = "Address is required";
    console.log("Validation failed for address: Missing"); // Logga vid fel
  } else if (address.length < 5) {
    errors.address = "Address must be at least 5 characters long";
    console.log("Validation failed for address: Too short"); // Logga vid fel
  }

  if (!country) {
    errors.country = "Country is required";
    console.log("Validation failed for country: Missing"); // Logga vid fel
  } else if (country.length < 2) {
    errors.country = "Country must be at least 2 characters long";
    console.log("Validation failed for country: Too short"); // Logga vid fel
  }

  if (dailyRate === undefined || dailyRate === null) {
    errors.dailyRate = "Daily rate is required";
    console.log("Validation failed for daily rate: Missing"); // Logga vid fel
  } else if (dailyRate <= 0) {
    errors.dailyRate = "Daily rate must be greater than 0";
    console.log("Validation failed for daily rate: Too low"); // Logga vid fel
  }

  const hasErrors = Object.keys(errors).length !== 0;

  console.log("Validation result:", { hasErrors, errors }); // Logga slutligt resultat
  return [hasErrors, errors];
}
