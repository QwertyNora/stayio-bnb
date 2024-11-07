import { PrismaClient } from "@prisma/client";

type ErrorObject = {
  [key: string]: any;
};

type PartialBookingData = Partial<BookingData>;

const prisma = new PrismaClient();

export default async function bookingValidator(
  data: PartialBookingData,
  id?: string
): Promise<[boolean, ErrorObject]> {
  let errors: ErrorObject = {};
  const { checkInDate, checkOutDate, totalPrice, listingId, createdById } =
    data;

  if (checkInDate && checkOutDate) {
    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      errors.checkOutDate = "Check-out date must be later than check-in date";
    }
  }

  if (totalPrice && totalPrice <= 0) {
    errors.totalPrice = "Total price must be greater than 0";
  }

  if (!listingId) {
    errors.listingId = "A valid Listing ID is required";
  }

  if (!createdById) {
    errors.createdById = "A valid User ID is required";
  }

  const hasErrors = Object.keys(errors).length !== 0;

  return [hasErrors, errors];
}
