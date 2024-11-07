"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ListingCard from "./listing-card";
import { useMediaQuery } from "@/hooks/use-media-query";

interface FeaturedListingsSliderProps {
  listings: Listing[];
}

export default function FeaturedListingsSlider({
  listings,
}: FeaturedListingsSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  const isMediumScreen = useMediaQuery("(min-width: 768px)");

  const visibleCount = isLargeScreen ? 3 : isMediumScreen ? 2 : 1;
  const totalListings = Math.min(listings.length, 6);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalListings);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + totalListings) % totalListings
    );
  };

  const getVisibleListings = () => {
    const visibleListings = [];
    for (let i = 0; i < visibleCount; i++) {
      const index = (currentIndex + i) % totalListings;
      visibleListings.push(listings[index]);
    }
    return visibleListings;
  };

  return (
    <div className="relative px-4 md:px-8 lg:px-16 h-[500px] md:h-[500px] lg:h-[500px]">
      <div className="absolute inset-0 overflow-hidden" ref={sliderRef}>
        <AnimatePresence initial={false}>
          <motion.div
            key={currentIndex}
            className="flex justify-center items-center h-full"
          >
            {getVisibleListings().map((listing, index) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.5 },
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`flex items-center justify-center px-2 ${
                  visibleCount === 1
                    ? "w-full"
                    : visibleCount === 2
                    ? "w-1/2"
                    : "w-1/3"
                }`}
              >
                <div
                  className={`w-full ${
                    visibleCount === 1 ? "max-w-sm" : "max-w-xs"
                  }`}
                >
                  <ListingCard listing={listing} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
      {totalListings > visibleCount && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-20"
            aria-label="Previous listings"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-20"
            aria-label="Next listings"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}
    </div>
  );
}

// "use client";

// import { useState, useEffect, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import ListingCard from "./listing-card";
// import { useMediaQuery } from "@/hooks/use-media-query";

// interface FeaturedListingsSliderProps {
//   listings: Listing[];
// }

// export default function FeaturedListingsSlider({
//   listings,
// }: FeaturedListingsSliderProps) {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [sliderHeight, setSliderHeight] = useState(0);
//   const sliderRef = useRef<HTMLDivElement>(null);
//   const isLargeScreen = useMediaQuery("(min-width: 1024px)");
//   const isMediumScreen = useMediaQuery("(min-width: 768px)");

//   const visibleCount = isLargeScreen ? 3 : isMediumScreen ? 2 : 1;
//   const totalListings = Math.min(listings.length, 6);

//   useEffect(() => {
//     const updateHeight = () => {
//       if (sliderRef.current) {
//         const height = sliderRef.current.scrollHeight;
//         setSliderHeight(height);
//       }
//     };

//     updateHeight();
//     window.addEventListener("resize", updateHeight);
//     return () => window.removeEventListener("resize", updateHeight);
//   }, [listings, isLargeScreen, isMediumScreen]);

//   const nextSlide = () => {
//     setCurrentIndex((prevIndex) => (prevIndex + 1) % totalListings);
//   };

//   const prevSlide = () => {
//     setCurrentIndex(
//       (prevIndex) => (prevIndex - 1 + totalListings) % totalListings
//     );
//   };

//   const getVisibleListings = () => {
//     const visibleListings = [];
//     for (let i = 0; i < visibleCount; i++) {
//       const index = (currentIndex + i) % totalListings;
//       visibleListings.push(listings[index]);
//     }
//     return visibleListings;
//   };

//   return (
//     <div className="relative px-12" style={{ height: `${sliderHeight}px` }}>
//       <div className="overflow-hidden" ref={sliderRef}>
//         <AnimatePresence initial={false}>
//           <motion.div
//             key={currentIndex}
//             className="flex justify-center items-center gap-4"
//           >
//             {getVisibleListings().map((listing, index) => (
//               <motion.div
//                 key={listing.id}
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={{
//                   opacity: 1,
//                   scale: index === Math.floor(visibleCount / 2) ? 1 : 0.9,
//                   transition: { duration: 0.5 },
//                 }}
//                 exit={{ opacity: 0, scale: 0.8 }}
//                 className={`flex-shrink-0 w-full ${
//                   visibleCount === 1 ? "max-w-sm" : "max-w-xs"
//                 } ${index === Math.floor(visibleCount / 2) ? "z-10" : "z-0"}`}
//               >
//                 <ListingCard listing={listing} />
//               </motion.div>
//             ))}
//           </motion.div>
//         </AnimatePresence>
//       </div>
//       <button
//         onClick={prevSlide}
//         className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-20"
//         aria-label="Previous listings"
//       >
//         <ChevronLeft className="w-6 h-6" />
//       </button>
//       <button
//         onClick={nextSlide}
//         className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-20"
//         aria-label="Next listings"
//       >
//         <ChevronRight className="w-6 h-6" />
//       </button>
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import ListingCard from "./listing-card";
// import { useMediaQuery } from "@/hooks/use-media-query";

// interface FeaturedListingsSliderProps {
//   listings: Listing[];
// }

// export default function FeaturedListingsSlider({
//   listings,
// }: FeaturedListingsSliderProps) {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const isLargeScreen = useMediaQuery("(min-width: 1024px)");
//   const isMediumScreen = useMediaQuery("(min-width: 768px)");

//   const visibleCount = isLargeScreen ? 3 : isMediumScreen ? 2 : 1;
//   const totalListings = Math.min(listings.length, 6);

//   const nextSlide = () => {
//     setCurrentIndex((prevIndex) => (prevIndex + 1) % totalListings);
//   };

//   const prevSlide = () => {
//     setCurrentIndex(
//       (prevIndex) => (prevIndex - 1 + totalListings) % totalListings
//     );
//   };

//   const getVisibleListings = () => {
//     const visibleListings = [];
//     for (let i = 0; i < visibleCount; i++) {
//       const index = (currentIndex + i) % totalListings;
//       visibleListings.push(listings[index]);
//     }
//     return visibleListings;
//   };

//   return (
//     <div className="relative px-12">
//       <div className="overflow-hidden">
//         <AnimatePresence initial={false}>
//           <motion.div
//             key={currentIndex}
//             className="flex justify-center items-center gap-4"
//           >
//             {getVisibleListings().map((listing, index) => (
//               <motion.div
//                 key={listing.id}
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={{
//                   opacity: 1,
//                   scale: index === Math.floor(visibleCount / 2) ? 1 : 0.9,
//                   transition: { duration: 0.5 },
//                 }}
//                 exit={{ opacity: 0, scale: 0.8 }}
//                 className={`flex-shrink-0 w-full ${
//                   visibleCount === 1 ? "max-w-sm" : "max-w-xs"
//                 } ${index === Math.floor(visibleCount / 2) ? "z-10" : "z-0"}`}
//               >
//                 <ListingCard listing={listing} />
//               </motion.div>
//             ))}
//           </motion.div>
//         </AnimatePresence>
//       </div>
//       <button
//         onClick={prevSlide}
//         className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-20"
//         aria-label="Previous listings"
//       >
//         <ChevronLeft className="w-6 h-6" />
//       </button>
//       <button
//         onClick={nextSlide}
//         className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-20"
//         aria-label="Next listings"
//       >
//         <ChevronRight className="w-6 h-6" />
//       </button>
//     </div>
//   );
// }
