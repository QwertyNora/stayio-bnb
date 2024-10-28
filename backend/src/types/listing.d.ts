type Listing = {
  id: string;
  title: string;
  description: string;
  address: string;
  country: string;
  dailyRate: number;
  createdById: string;
  bookedDates: Date[];
  createdAt: Date;
  updatedAt: Date;
  images?: string[];
};

type ListingData = Omit<Listing, "id" | "createdAt" | "updatedAt"> & {
  newImages?: string[];
  removedImages?: string[];
};
