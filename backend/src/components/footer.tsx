"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <motion.span
              className="text-2xl font-bold text-primary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              StayIO
            </motion.span>
            <p className="text-gray-500 text-base">
              Find your perfect stay, anywhere in the world.
            </p>
            <div className="flex space-x-6">
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </motion.a>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Company
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link
                      href="/about"
                      className="text-base text-gray-500 hover:text-gray-900"
                    >
                      About
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/careers"
                      className="text-base text-gray-500 hover:text-gray-900"
                    >
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="text-base text-gray-500 hover:text-gray-900"
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Support
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link
                      href="/help"
                      className="text-base text-gray-500 hover:text-gray-900"
                    >
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/terms"
                      className="text-base text-gray-500 hover:text-gray-900"
                    >
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/privacy"
                      className="text-base text-gray-500 hover:text-gray-900"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 xl:text-center">
            &copy; {currentYear} StayIO. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
