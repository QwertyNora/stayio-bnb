"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

interface ReviewProps {
  firstName: string;
  lastName: string;
  comment: string;
  rating: number;
  avatarUrl?: string;
}

export default function ReviewComponent({
  firstName,
  lastName,
  comment,
  rating,
  avatarUrl,
}: ReviewProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <Avatar>
              <AvatarImage src={avatarUrl} alt={`${firstName} ${lastName}`} />
              <AvatarFallback>
                <User className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">
                {firstName} {lastName}
              </h3>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(rating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {rating.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
          <motion.p
            className={`italic text-gray-600 ${
              isExpanded ? "" : "line-clamp-3"
            }`}
            onClick={toggleExpand}
          >
            "{comment}"
          </motion.p>
          {comment.length > 150 && (
            <button
              onClick={toggleExpand}
              className="mt-2 text-sm text-primary hover:underline focus:outline-none"
            >
              {isExpanded ? "Show less" : "Read more"}
            </button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
