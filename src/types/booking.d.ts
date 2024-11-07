type Booking = {
  id: string;
  createdDate: Date;
  checkInDate: Date;
  checkOutDate: Date;
  totalPrice: number;
  listingId: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
};

type BookingData = Omit<Booking, "id" | "createdAt" | "updatedAt">;
