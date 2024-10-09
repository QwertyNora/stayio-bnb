type User = {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

type UserData = Omit<User, "id" | "createdAt" | "updatedAt">;
