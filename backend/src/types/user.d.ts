type User = {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

type UserData = Omit<User, "id" | "createdAt" | "updatedAt">;
