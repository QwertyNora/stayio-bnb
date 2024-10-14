"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LocalStorageKit from "@/utils/localStorageKit";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const token = LocalStorageKit.get("@library/token");
    setIsLoggedIn(!!token);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    LocalStorageKit.remove("@library/token");
    setIsLoggedIn(false);
    router.push("/login");
  };

  const menuVariants = {
    closed: { opacity: 0, x: "-100%" },
    open: { opacity: 1, x: 0 },
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <motion.span
                className="text-2xl font-bold text-primary"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                StayIO
              </motion.span>
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="flex space-x-4">
              <Input
                type="text"
                placeholder="Search listings..."
                className="w-64"
              />
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
              </Button>
            </div>
            {isLoggedIn ? (
              <>
                <Link href="/profile">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="ghost" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
          <div className="flex items-center sm:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="sm:hidden"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            transition={{ duration: 0.3 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Input
                type="text"
                placeholder="Search listings..."
                className="w-full mb-2"
              />
              {isLoggedIn ? (
                <>
                  <Link href="/profile">
                    <Button variant="ghost" className="w-full text-left">
                      Profile
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full text-left"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" className="w-full text-left">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navigation;

// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { motion, AnimatePresence } from "framer-motion";
// import { Menu, X, Search, User } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// const Navigation = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const pathname = usePathname();

//   useEffect(() => {
//     // Check if user is logged in
//     // This is a placeholder. Replace with your actual auth check
//     const token = localStorage.getItem("token");
//     setIsLoggedIn(!!token);
//   }, []);

//   const toggleMenu = () => setIsOpen(!isOpen);

//   const menuVariants = {
//     closed: { opacity: 0, x: "-100%" },
//     open: { opacity: 1, x: 0 },
//   };

//   return (
//     <nav className="bg-white shadow-md">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           <div className="flex">
//             <Link href="/" className="flex-shrink-0 flex items-center">
//               <motion.span
//                 className="text-2xl font-bold text-primary"
//                 initial={{ opacity: 0, y: -20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5 }}
//               >
//                 StayIO
//               </motion.span>
//             </Link>
//           </div>
//           <div className="hidden sm:ml-6 sm:flex sm:items-center">
//             <div className="flex space-x-4">
//               <Input
//                 type="text"
//                 placeholder="Search listings..."
//                 className="w-64"
//               />
//               <Button variant="ghost" size="icon">
//                 <Search className="h-5 w-5" />
//               </Button>
//             </div>
//             {isLoggedIn ? (
//               <Link href="/profile">
//                 <Button variant="ghost" size="icon">
//                   <User className="h-5 w-5" />
//                 </Button>
//               </Link>
//             ) : (
//               <>
//                 <Link href="/login">
//                   <Button variant="ghost">Sign In</Button>
//                 </Link>
//                 <Link href="/signup">
//                   <Button>Sign Up</Button>
//                 </Link>
//               </>
//             )}
//           </div>
//           <div className="flex items-center sm:hidden">
//             <Button variant="ghost" size="icon" onClick={toggleMenu}>
//               {isOpen ? (
//                 <X className="h-6 w-6" />
//               ) : (
//                 <Menu className="h-6 w-6" />
//               )}
//             </Button>
//           </div>
//         </div>
//       </div>

//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             className="sm:hidden"
//             initial="closed"
//             animate="open"
//             exit="closed"
//             variants={menuVariants}
//             transition={{ duration: 0.3 }}
//           >
//             <div className="px-2 pt-2 pb-3 space-y-1">
//               <Input
//                 type="text"
//                 placeholder="Search listings..."
//                 className="w-full mb-2"
//               />
//               {isLoggedIn ? (
//                 <Link href="/profile">
//                   <Button variant="ghost" className="w-full text-left">
//                     Profile
//                   </Button>
//                 </Link>
//               ) : (
//                 <>
//                   <Link href="/login">
//                     <Button variant="ghost" className="w-full text-left">
//                       Sign In
//                     </Button>
//                   </Link>
//                   <Link href="/signup">
//                     <Button className="w-full">Sign Up</Button>
//                   </Link>
//                 </>
//               )}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </nav>
//   );
// };

// export default Navigation;
