import { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(false);

  const authUser = (userPassword) => {
    return userPassword === import.meta.env.VITE_ADMIN_PASS;
  };
  return (
    <UserContext.Provider value={{ user, setUser, authUser }}>
      {children}
    </UserContext.Provider>
  );
};
