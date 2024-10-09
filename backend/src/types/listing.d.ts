type Listing = {
  id: string;
  title: string;
  description: string;
  address: string;
  country: string;
  dailyRate: number;
  createdById: string;
  bookedDates: Date[];
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type ListingData = Omit<
  Listing,
  "id" | "createdAt" | "updatedAt" | "createdById"
>;
