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
      const result = await loginAction(email, password);
      if (result.error) {
        onError(new Error(result.error));
      } else if (result.token) {
        setToken(result.token);
        LocalStorageKit.set("@library/token", result.token);
        onComplete(result.token);
      } else {
        onError(new Error("No token received after login"));
      }
    } catch (error: any) {
      console.error("Login error:", error);
      onError(error);
    }
  };

  const logout = () => {
    console.log("Logging out...");
    setUser(null);
    setToken(null);
    console.log("Removing token from LocalStorageKit...");
    LocalStorageKit.remove("@library/token");
  };

  const getUser = async () => {
    try {
      if (!token) return;
      const _user = await getUserAction(token);
      if (_user) {
        setUser(_user);
      } else {
        console.error("Failed to fetch user data");
        logout();
      }
    } catch (error: any) {
      console.error("Error fetching user:", error);
      if (error.message.includes("401") || error.message.includes("403")) {
        // Token might be expired or invalid
        logout();
      }
    }
  };
  return (
    <UserContext.Provider value={{ token, user, actions: { login, logout } }}>
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
