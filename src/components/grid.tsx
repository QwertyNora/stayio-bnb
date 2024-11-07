"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getListings } from "@/actions/getListings";
import { Listing } from "@prisma/client";
import Link from "next/link";

const placeholderImage =
  "https://images.pexels.com/photos/28216688/pexels-photo-28216688/free-photo-of-hostcamping.png";

export default function ListingsGrid() {
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    const fetchListings = async () => {
      const allListings = await getListings({});
      const shuffled = allListings.sort(() => 0.5 - Math.random());
      setListings(shuffled.slice(0, 5));
    };

    fetchListings();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-3 gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {listings.length > 0 && (
        <motion.div
          variants={itemVariants}
          className="md:col-span-1 md:row-span-1"
        >
          <ListingCard listing={listings[0]} isFeatured />
        </motion.div>
      )}
      <motion.div className="grid grid-cols-2 md:grid-rows-2 gap-4 md:col-span-1">
        {listings.slice(1).map((listing, index) => (
          <motion.div
            key={listing.id}
            variants={itemVariants}
            className={index >= 2 ? "md:col-start-auto" : ""}
          >
            <ListingCard listing={listing} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

interface ListingCardProps {
  listing: Listing;
  isFeatured?: boolean;
}

function ListingCard({ listing, isFeatured = false }: ListingCardProps) {
  return (
    <Card className="overflow-hidden  group">
      <CardContent className="p-0 relative h-full">
        <div
          className={`relative w-full ${
            isFeatured
              ? "h-[400px] md:h-[370px] lg:h-[420px]"
              : "h-[200px] md:h-[175px] lg:h-[200px]"
          }`}
        >
          <Image
            src={listing.images[0] || placeholderImage}
            alt={listing.title}
            layout="fill"
            objectFit="cover"
            className="transition-all duration-500 ease-in-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-0 right-0 bg-white/70 p-2 rounded-bl-lg shadow-md transition-transform duration-300 transform group-hover:scale-110 cursor-pointer">
            <Heart className="h-5 w-5 text-red-500" />
          </div>
          <Link
            href={`/listings/${listing.id || ""}`}
            className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
          >
            <h3
              className={`text-white text-xl font-semibold line-clamp-2 mb-2`}
            >
              {listing.title}
            </h3>
            <p className="text-white/80 text-sm line-clamp-2">
              {listing.description}
            </p>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
