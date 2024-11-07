"use client";

import { useEffect, useState } from "react";
import { getListingById } from "@/actions/getListingById";
import ListingClientComponent from "@/components/ListingClientComponent";
import Image from "next/image";
import { useUser } from "@/context/user";
import { Spinner } from "@/components/ui/spinner";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ListingDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useUser();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchListing = async () => {
      const fetchedListing = await getListingById(params.id);
      if (fetchedListing) {
        setListing(fetchedListing);
      }
      setLoading(false);
    };

    fetchListing();
  }, [params.id, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (!listing) {
    return null;
  }

  const placeholderImage =
    "https://images.pexels.com/photos/28216688/pexels-photo-28216688/free-photo-of-hostcamping.png";
  const images =
    listing.images && listing.images.length > 0
      ? listing.images
      : [placeholderImage];

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const bookedDates = listing.bookedDates.map((date: string) => new Date(date));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="relative w-full lg:w-1/2 h-96 rounded-lg overflow-hidden shadow-lg">
          <AnimatePresence initial={false}>
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <Image
                src={images[currentImageIndex]}
                alt={listing.title}
                fill
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>
          {images.length > 1 && (
            <>
              <button
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-200 transition-colors duration-200 focus:outline-none"
                onClick={prevImage}
              >
                <ChevronLeft className="h-8 w-8" />
                <span className="sr-only">Previous image</span>
              </button>
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-200 transition-colors duration-200 focus:outline-none"
                onClick={nextImage}
              >
                <ChevronRight className="h-8 w-8" />
                <span className="sr-only">Next image</span>
              </button>
            </>
          )}
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
