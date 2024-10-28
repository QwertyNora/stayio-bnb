import { getListings } from "@/actions/getListings";
import ListingCard from "@/components/listing-card";
import { Listing } from "@prisma/client";

export default async function ListingsPage() {
  const listings: Listing[] = await getListings({});

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Listings</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}
