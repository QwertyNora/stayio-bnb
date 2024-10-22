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

  // Uppdatera användarstatus när token sätts eller rensas
  useEffect(() => {
    if (token) {
      console.log("Fetching user with token:", token);
      getUser();
    } else {
      setUser(null); // Om token är null, logga ut användaren
    }
  }, [token]);

  const login = async (
    email: string,
    password: string,
    onComplete: OnComplete,
    onError: OnError
  ) => {
    try {
      const token = await loginAction(email, password); // Hämta token från API
      setToken(token);
      LocalStorageKit.set("@library/token", token); // Spara token i localStorage
      onComplete(token);
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

//! Gammal:

// "use client";
// import {
//   createContext,
//   PropsWithChildren,
//   useContext,
//   useEffect,
//   useState,
// } from "react";

// import { SafeUser } from "@/types/user";

// import { login as loginAction } from "@/actions/login";
// import { getUser as getUserAction } from "@/actions/getUser";
// import LocalStorageKit from "@/utils/localStorageKit";

// type OnComplete = (response?: any) => void;
// type OnError = (error?: any) => void;

// // default state
// type UserContextState = {
//   token: string | null;
//   user: SafeUser | null;
//   actions: {
//     login: (
//       email: string,
//       password: string,
//       onComplete: OnComplete,
//       onError: OnError
//     ) => Promise<void>;
//     logout: () => void;
//   };
// };

// const defaultState: UserContextState = {
//   token: null,
//   user: null,
//   actions: {
//     login: () => Promise.resolve(),
//     logout: () => {},
//   },
// };

// // context initator constructor
// const UserContext = createContext<Partial<UserContextState>>(defaultState);

// // provider
// function UserProvider({ children }: PropsWithChildren) {
//   const [token, setToken] = useState<typeof defaultState.token>(
//     defaultState.token
//   );
//   const [user, setUser] = useState<typeof defaultState.user>(defaultState.user);

//   useEffect(() => {
//     if (!token) {
//       let _token = LocalStorageKit.get("@library/token");
//       if (_token) {
//         setToken(_token);
//         return;
//       }
//     }
//   }, []);

//   useEffect(() => {
//     if (token && !user) {
//       getUser();
//     }
//   }, [token]);

//   const login: typeof defaultState.actions.login = async (
//     email,
//     password,
//     onComplete,
//     onError
//   ) => {
//     try {
//       const token = await loginAction(email, password);
//       setToken(token);
//       console.log(token);
//       LocalStorageKit.set("@library/token", token);
//     } catch (error: any) {
//       console.warn("Error logging in", error.message);
//       onError();
//     }
//   };

//   const logout = () => {
//     setUser(defaultState.user);
//     setToken(defaultState.token);
//     LocalStorageKit.remove("@library/token");
//   };

//   //TODO: register takes data sets token

//   const getUser = async () => {
//     try {
//       if (!token) {
//         throw new Error();
//       }
//       // return console.log("token", token)
//       const _user = await getUserAction(token);
//       console.log(_user);
//     } catch (error: any) {
//       console.log(error);
//       logout();
//     }
//   };

//   return (
//     <UserContext.Provider
//       value={{
//         token,
//         user,
//         actions: {
//           login,
//           logout,
//         },
//       }}
//     >
//       {children}
//     </UserContext.Provider>
//   );
// }

// // use hook
// function useUser() {
//   const user = useContext(UserContext);
//   if (!user) {
//     throw new Error("'useUser' used outside of provider");
//   }
//   return user as UserContextState;
// }

// export { UserProvider, useUser };
