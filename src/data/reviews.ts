export interface Review {
  id: number;
  firstName: string;
  lastName: string;
  comment: string;
  rating: number;
  avatarUrl: string;
}

export const reviews: Review[] = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    comment:
      "Amazing experience! The place was exactly as described and the host was very accommodating.",
    rating: 5,
    avatarUrl: "/avatars/john-doe.jpg",
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    comment: "Great location and beautiful views. Would definitely recommend!",
    rating: 4.5,
    avatarUrl: "/avatars/jane-smith.jpg",
  },
  {
    id: 3,
    firstName: "Mike",
    lastName: "Johnson",
    comment: "Clean, comfortable, and convenient. Couldn't ask for more.",
    rating: 4,
    avatarUrl: "/avatars/mike-johnson.jpg",
  },
];
