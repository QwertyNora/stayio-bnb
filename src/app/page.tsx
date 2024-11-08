"use client";

import { useEffect, useState, Suspense } from "react";
import { getListings } from "@/actions/getListings";
import FeaturedListingsSlider from "@/components/featured";
import ReviewComponent from "@/components/review";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Spinner } from "@/components/ui/spinner";
import { reviews, Review } from "@/data/reviews";
import ListingsGrid from "@/components/grid";

const heroImages = [
  "/images/image-1.jpg",
  "/images/image-2.jpg",
  "/images/image-3.jpg",
  "/images/image-4.jpg",
  "/images/image-5.jpg",
  "/images/image-6.jpg",
  "/images/image-7.jpg",
  "/images/image-8.jpg",
  "/images/image-9.jpg",
];

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingsData = await getListings({});
        setListings(listingsData.slice(0, 5)); // Only keep the 5 most recent listings
        setLoading(false);
      } catch (err) {
        setError("Error fetching listings");
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
        <Spinner className="text-grey-100">
          <span className="text-grey-200">Loading ...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-screen overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <Image
              src={heroImages[currentImageIndex]}
              alt={`Hero image ${currentImageIndex + 1}`}
              layout="fill"
              objectFit="cover"
              quality={100}
              priority
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 flex flex-col justify-center items-center h-full text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-5xl font-bold"
          >
            Discover Your Next Adventure
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-xl mt-4"
          >
            Find unique places to stay, curated for every type of traveler.
          </motion.p>
          <Link href="/listings">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="mt-8 px-6 py-3 bg-red-500 rounded-full hover:bg-red-600 transition"
            >
              Get Started
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Featured Listings */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-semibold text-center mb-8">
          Featured Listings
        </h2>
        <FeaturedListingsSlider listings={listings} />
      </section>

      {/* Reviews Section */}
      <section className=" py-12">
        <div className="container mx-auto px-4 my-9">
          <h2 className="text-3xl font-semibold text-center mb-16">
            What Our Guests Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-32">
            {reviews.map((review: Review) => (
              <ReviewComponent
                key={review.id}
                firstName={review.firstName}
                lastName={review.lastName}
                comment={review.comment}
                rating={review.rating}
                avatarUrl={review.avatarUrl}
              />
            ))}
          </div>
        </div>
      </section>
      {/* Random Listings Grid */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-semibold text-center mb-8">
          Explore More Listings
        </h2>
        <Suspense fallback={<Spinner className="m-4" />}>
          <ListingsGrid />
        </Suspense>
      </section>
    </div>
  );
}
