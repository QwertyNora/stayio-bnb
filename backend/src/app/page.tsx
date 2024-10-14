"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
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

      {/* Featured Listings (Static, for visual purposes) */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-semibold text-center mb-8">
          Featured Listings
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Static listings for visual purposes */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <img
              className="w-full h-48 object-cover"
              src="https://via.placeholder.com/400x300?text=Beach+Villa"
              alt="Beach Villa"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">Beach Villa</h3>
              <p className="text-gray-600">$200/night</p>
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <img
              className="w-full h-48 object-cover"
              src="https://via.placeholder.com/400x300?text=Mountain+Cabin"
              alt="Mountain Cabin"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">Mountain Cabin</h3>
              <p className="text-gray-600">$150/night</p>
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <img
              className="w-full h-48 object-cover"
              src="https://via.placeholder.com/400x300?text=City+Apartment"
              alt="City Apartment"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">City Apartment</h3>
              <p className="text-gray-600">$180/night</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
