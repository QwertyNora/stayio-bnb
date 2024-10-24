"use client";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { SafeUser } from "@/types/user";
import { login as loginAction } from "@/actions/login";
import { getUser as getUserAction } from "@/actions/getUser";
import LocalStorageKit from "@/utils/localStorageKit";

type OnComplete = (response?: any) => void;
type OnError = (error?: any) => void;

type UserContextState = {
  token: string | null;
  user: SafeUser | null;
  actions: {
    login: (
      email: string,
      password: string,
      onComplete: OnComplete,
      onError: OnError
    ) => Promise<void>;
    logout: () => void;
  };
};

const defaultState: UserContextState = {
  token: null,
  user: null,
  actions: {
    login: () => Promise.resolve(),
    logout: () => {},
  },
};

const UserContext = createContext<Partial<UserContextState>>(defaultState);

function UserProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(
    LocalStorageKit.get("@library/token")
  );
  const [user, setUser] = useState<SafeUser | null>(null);

  useEffect(() => {
    if (token) {
      console.log("Fetching user with token:", token);
      getUser();
    } else {
      setUser(null);
    }
  }, [token]);

  const login = async (
    email: string,
    password: string,
    onComplete: OnComplete,
    onError: OnError
  ) => {
    try {
      const newToken = await loginAction(email, password);
      setToken(newToken);
      LocalStorageKit.set("@library/token", newToken);
      onComplete(newToken);
    } catch (error: any) {
      onError(error);
    }
  };

  const logout = () => {
    console.log("Logging out...");
    setUser(null);
    setToken(null);
    console.log("Removing token from LocalStorageKit...");
    LocalStorageKit.remove("@library/token"); // Rensa token från localStorage
    setTimeout(() => {
      console.log(
        "Token after timeout: ",
        localStorage.getItem("@library/token")
      );
    }, 500); // Vänta 500 ms och kontrollera om token är borta
  };

  const getUser = async () => {
    try {
      if (!token) return;
      const _user = await getUserAction(token);
      setUser(_user);
    } catch (error: any) {
      logout(); // Logga ut om token är ogiltig
    }
  };

  return (
    <UserContext.Provider
      value={{
        token,
        user,
        actions: { login, logout },
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("'useUser' must be used within a UserProvider");
  }
  return context as UserContextState;
}

export { UserProvider, useUser };
