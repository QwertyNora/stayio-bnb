"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const backendUrl = "http://localhost:3000";

export default function Listings() {
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get(`${backendUrl}/api/listings`);
      setListings(response.data);
    };

    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Listings</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {listings.map((listing) => (
          <div
            key={listing.id}
            className="bg-white shadow-lg rounded-lg overflow-hidden transform transition hover:scale-105 duration-300 ease-in-out"
          >
            <img
              className="w-full h-48 object-cover"
              src={`https://via.placeholder.com/400?text=${listing.title}`}
              alt={listing.title}
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{listing.title}</h2>
              <p className="text-gray-600 mb-4">
                Price: ${listing.dailyRate}/night
              </p>
              <p className="text-gray-800">{listing.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
