"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react"; // Import icons for showing/hiding password
import { useUser } from "@/context/user";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for showing/hiding password
  const [error, setError] = useState("");
  const router = useRouter();

  // Hämta actions från useUser
  const { actions } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Rensa tidigare felmeddelanden

    // Anropa login från useUser-actions
    actions.login(
      email,
      password,
      () => {
        router.push("/"); // Redirect till startsidan vid lyckad inloggning
      },
      (err) => {
        setError("Invalid email or password"); // Visa felmeddelande vid misslyckad inloggning
      }
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white sm:bg-gray-100 ">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg px-6 sm:px-0" // Adjust padding for mobile
      >
        <Card className="p-8 bg-white shadow-none rounded-none border-none sm:shadow-lg sm:rounded-lg sm:border">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid w-full items-center gap-6">
                {/* Email */}
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="email">Email or username</Label>
                  <Input
                    id="email"
                    type="text"
                    placeholder="Enter your email or username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {/* Password */}
                <div className="flex flex-col space-y-2 relative">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"} // Toggle between text and password types
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-2 text-gray-500"
                      onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push("/register")}>
              Register
            </Button>
            <Button onClick={handleSubmit}>Login</Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
