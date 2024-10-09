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

  // Validera endast om fältet finns
  if (title && title.length < 3) {
    errors.title = "Title must be at least 3 characters long";
  }

  if (description && description.length < 10) {
    errors.description = "Description must be at least 10 characters long";
  }

  if (address && address.length < 5) {
    errors.address = "Address must be at least 5 characters long";
  }

  if (country && country.length < 2) {
    errors.country = "Country must be at least 2 characters long";
  }

  if (dailyRate && dailyRate <= 0) {
    errors.dailyRate = "Daily rate must be greater than 0";
  }

  const hasErrors = Object.keys(errors).length !== 0;

  return [hasErrors, errors];
}
