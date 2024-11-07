"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user";
import { getListings } from "@/actions/getListings";
import { Listing } from "@prisma/client";
import ListingCard from "./listing-card";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

import {
  Menu,
  Search,
  User,
  LogOut,
  X,
  LogIn,
  UserPlus,
  Home,
  BookOpen,
  List,
  CalendarFold,
  Shield,
} from "lucide-react";

export function Navigation() {
  const { user, actions } = useUser();
  const router = useRouter();
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Listing[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    actions.logout();
    router.push("/login");
  };

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const listings = await getListings({});
      const filteredListings = listings.filter(
        (listing) =>
          listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          listing.country.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredListings);
      setShowResults(true);
    } catch (error) {
      console.error("Error searching listings:", error);
    }
    setIsSearching(false);
  };

  const renderSearchBar = () => (
    <div className="flex items-center flex-grow max-w-md mx-2">
      <Input
        type="text"
        placeholder="Search listings..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full"
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={handleSearch}
        disabled={isSearching}
        className="ml-2"
      >
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );

  const renderDesktopNav = () => (
    <NavigationMenu className="hidden md:flex w-full justify-between items-center">
      <NavigationMenuList className="flex-grow">
        <NavigationMenuItem className="flex-grow">
          {renderSearchBar()}
        </NavigationMenuItem>
        {user ? (
          <>
            <NavigationMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center">
                      <Home className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/profile/bookings"
                      className="flex items-center"
                    >
                      <CalendarFold className="mr-2 h-4 w-4" />
                      My Bookings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/profile/listings"
                      className="flex items-center"
                    >
                      <List className="mr-2 h-4 w-4" />
                      My Listings
                    </Link>
                  </DropdownMenuItem>
                  {user.isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild className="text-blue-600">
                        <Link href="/admin" className="flex items-center">
                          <Shield className="mr-2 h-4 w-4" />
                          Admin
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </NavigationMenuItem>
          </>
        ) : (
          <>
            <NavigationMenuItem>
              <Link href="/login" legacyBehavior passHref>
                <NavigationMenuLink>
                  <Button variant="outline" className="mr-2">
                    Sign In
                  </Button>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/register" legacyBehavior passHref>
                <NavigationMenuLink>
                  <Button>Sign Up</Button>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );

  const renderMobileNav = () => (
    <div className="flex md:hidden items-center">
      {renderSearchBar()}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className="py-4 flex flex-col items-center">
            {user ? (
              <>
                <Button
                  variant="ghost"
                  className="w-full justify-start mb-2"
                  asChild
                >
                  <Link href="/profile">
                    <Home className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start mb-2"
                  asChild
                >
                  <Link href="/profile/bookings">
                    <CalendarFold className="mr-2 h-4 w-4" />
                    My Bookings
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start mb-2"
                  asChild
                >
                  <Link href="/profile/listings">
                    <List className="mr-2 h-4 w-4" />
                    My Listings
                  </Link>
                </Button>
                {user.isAdmin && (
                  <>
                    <Separator className="my-2" />
                    <Button
                      variant="ghost"
                      className="w-full justify-center mb-2 bg-blue-500 text-white"
                      asChild
                    >
                      <Link href="/admin">
                        <Shield className="mr-2 h-4 w-4" />
                        Admin
                      </Link>
                    </Button>
                  </>
                )}
                <Separator className="my-2" />
                <Button
                  variant="destructive"
                  className="w-full justify-center"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" className="w-full mb-2" asChild>
                  <Link href="/login">
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Link>
                </Button>
                <Button className="w-full" asChild>
                  <Link href="/register">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Sign Up
                  </Link>
                </Button>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );

  return (
    <>
      <nav className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="font-bold text-2xl">
            StayIO
          </Link>
          {renderDesktopNav()}
          {renderMobileNav()}
        </div>
      </nav>
      {showResults && searchResults.length > 0 && (
        <div className="container mx-auto mt-4 px-4 relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-0 right-0 mt-2 mr-2"
            onClick={() => setShowResults(false)}
          >
            <X className="h-6 w-6" />
          </Button>
          <h2 className="text-2xl font-bold mb-4">Search Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
