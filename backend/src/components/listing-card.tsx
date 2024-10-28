"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Listing } from "@prisma/client";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

interface ListingCardProps {
  listing: Partial<Listing> | undefined;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const placeholderImage =
    "https://images.pexels.com/photos/28216688/pexels-photo-28216688/free-photo-of-hostcamping.png";

  if (!listing) {
    console.error("Listing is undefined");
    return (
      <Card className="w-full max-w-[288px] h-[450px] overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
        <CardHeader>
          <CardTitle>Error: Invalid Listing</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This listing could not be displayed due to missing data.</p>
        </CardContent>
      </Card>
    );
  }

  const images =
    listing.images && Array.isArray(listing.images) && listing.images.length > 0
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

  return (
    <Card className="w-full max-w-[288px] h-[450px] overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col mb-10">
      <div className="relative w-full h-48">
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
              alt={listing.title || "Listing"}
              layout="fill"
              objectFit="cover"
              quality={100}
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
      <CardHeader className="pb-2">
        <CardTitle className="text-lg line-clamp-1">
          {listing.title || "Untitled Listing"}
        </CardTitle>
        <CardDescription className="line-clamp-1">
          {listing.address && listing.country
            ? `${listing.address}, ${listing.country}`
            : "Location not specified"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {listing.description || "No description available"}
        </p>
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold">
            ${listing.dailyRate?.toFixed(2) || "N/A"} / night
          </p>
        </div>
      </CardContent>
      <CardFooter className="mt-auto">
        <Link href={`/listings/${listing.id || ""}`} className="w-full">
          <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white transition-colors duration-300 flex items-center justify-center group">
            View Details
            <motion.div
              className="ml-2"
              initial={{ x: 0 }}
              whileHover={{ x: [0, 3, 0, -3, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ArrowRight className="h-4 w-4" />
            </motion.div>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

// import Image from "next/image";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Listing } from "@prisma/client";
// import Link from "next/link";

// interface ListingCardProps {
//   listing: Listing;
// }

// export function ListingCard({ listing }: ListingCardProps) {
//   const imageUrl =
//     listing.images && listing.images.length > 0
//       ? listing.images[0] // Använd första bilden från Cloudinary
//       : "https://images.pexels.com/photos/28216688/pexels-photo-28216688/free-photo-of-hostcamping.png"; // Fallback-bild

//   return (
//     <Card className="overflow-hidden">
//       <div className="relative h-48">
//         <Image
//           src={imageUrl}
//           alt={listing.title}
//           fill
//           style={{ objectFit: "cover" }}
//         />
//       </div>
//       <CardHeader>
//         <CardTitle>{listing.title}</CardTitle>
//         <CardDescription>
//           {listing.address}, {listing.country}
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <p className="text-sm text-gray-600 mb-4">{listing.description}</p>
//         <div className="flex justify-between items-center">
//           <p className="text-lg font-semibold">
//             ${listing.dailyRate.toFixed(2)} / night
//           </p>
//         </div>
//       </CardContent>
//       <CardFooter>
//         <Link href={`/listings/${listing.id}`}>
//           <Button className="w-full">View Details</Button>
//         </Link>
//       </CardFooter>
//     </Card>
//   );
// }

// import Image from "next/image";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Listing } from "@prisma/client";
// import Link from "next/link";

// interface ListingCardProps {
//   listing: Listing;
// }

// export function ListingCard({ listing }: ListingCardProps) {
//   return (
//     <Card className="overflow-hidden">
//       <div className="relative h-48">
//         <Image
//           src={`https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?text=${listing.title}`}
//           alt={listing.title}
//           fill
//           style={{ objectFit: "cover" }}
//         />
//       </div>
//       <CardHeader>
//         <CardTitle>{listing.title}</CardTitle>
//         <CardDescription>
//           {listing.address}, {listing.country}
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <p className="text-sm text-gray-600 mb-4">{listing.description}</p>
//         <div className="flex justify-between items-center">
//           <p className="text-lg font-semibold">
//             ${listing.dailyRate.toFixed(2)} / night
//           </p>
//         </div>
//       </CardContent>
//       <CardFooter>
//         <Link href={`/listings/${listing.id}`}>
//           <Button className="w-full">View Details</Button>
//         </Link>
//       </CardFooter>
//     </Card>
//   );
// }
