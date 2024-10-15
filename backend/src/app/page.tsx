"use client";

import { useEffect, useState } from "react";
import { getListings } from "@/actions/getListings";
import AuthForm from "@/components/Auth/AuthForm";
import { ListingCard } from "@/components/listing-card";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]); // State to hold listings
  const [loading, setLoading] = useState(true); // State to track loading
  const [error, setError] = useState(""); // State to track errors

  // Fetch listings using useEffect (client-side)
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingsData = await getListings({});
        setListings(listingsData);
        setLoading(false);
      } catch (err) {
        setError("Error fetching listings");
        setLoading(false);
      }
    };

    fetchListings();
  }, []); // Empty dependency array ensures it only runs once

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative h-screen bg-cover bg-center"
        style={{
          backgroundImage: `url('https://via.placeholder.com/1920x1080?text=Explore+Your+Next+Adventure')`,
        }}
      >
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
      </section>

      {/* Featured Listings */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-semibold text-center mb-8">
          Featured Listings
        </h2>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
        <AuthForm />
      </section>
    </div>
  );
}

// "use client";

// import { getListings } from "@/actions/getListings";
// import AuthForm from "@/components/Auth/AuthForm";
// import { ListingCard } from "@/components/listing-card";
// import { motion } from "framer-motion";
// import Link from "next/link";
// import { useEffect } from "react";

// export default async function Home() {
//   const listings: Listing[] = await getListings({});

//    // Fetch listings using useEffect
//   useEffect(() => {
//     const fetchListings = async () => {
//       try {
//         const listingsData = await getListings({});
//         setListings(listingsData);
//       } catch (error) {
//         console.error("Error fetching listings", error);
//       }
//     };

//     fetchListings();
//   }, []);
//   return (
//     <div>
//       {/* Hero Section */}
//       <section
//         className="relative h-screen bg-cover bg-center"
//         style={{
//           backgroundImage: `url('https://via.placeholder.com/1920x1080?text=Explore+Your+Next+Adventure')`,
//         }}
//       >
//         <div className="absolute inset-0 bg-black opacity-50"></div>
//         <div className="relative z-10 flex flex-col justify-center items-center h-full text-center text-white">
//           <motion.h1
//             initial={{ opacity: 0, y: -50 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 1 }}
//             className="text-5xl font-bold"
//           >
//             Discover Your Next Adventure
//           </motion.h1>
//           <motion.p
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.5, duration: 1 }}
//             className="text-xl mt-4"
//           >
//             Find unique places to stay, curated for every type of traveler.
//           </motion.p>
//           <Link href="/listings">
//             <motion.button
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 1, duration: 1 }}
//               className="mt-8 px-6 py-3 bg-red-500 rounded-full hover:bg-red-600 transition"
//             >
//               Get Started
//             </motion.button>
//           </Link>
//         </div>
//       </section>

//       {/* Featured Listings (Static, for visual purposes) */}
//       <section className="container mx-auto px-4 py-12">
//         <h2 className="text-3xl font-semibold text-center mb-8">
//           Featured Listings
//         </h2>
//         <div className="container mx-auto px-4 py-8">
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {listings.map((listing) => (
//               <ListingCard key={listing.id} listing={listing} />
//             ))}
//           </div>
//         </div>
//         <AuthForm />
//       </section>
//     </div>
//   );
// }
