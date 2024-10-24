import { getListingById } from "@/actions/getListingById";
import ListingClientComponent from "@/components/ListingClientComponent";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function ListingDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const listing = await getListingById(params.id);

  if (!listing) {
    notFound();
  }

  const bookedDates = listing.bookedDates.map((date: Date) => new Date(date));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="relative w-full lg:w-1/2 h-96">
          <Image
            src={`https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?text=${listing.title}`}
            alt={listing.title}
            fill
            className="object-cover rounded-lg"
          />
        </div>

        <div className="w-full lg:w-1/2">
          <h1 className="text-4xl font-bold mb-4">{listing.title}</h1>
          <p className="text-lg mb-4 text-gray-600">
            {listing.address}, {listing.country}
          </p>
          <p className="text-2xl font-semibold mb-6">
            ${listing.dailyRate.toFixed(2)} / night
          </p>
          <p className="text-gray-700 mb-6">{listing.description}</p>

          <ListingClientComponent
            listingId={listing.id}
            bookedDates={bookedDates}
            dailyRate={listing.dailyRate}
          />
        </div>
      </div>
    </div>
  );
}
