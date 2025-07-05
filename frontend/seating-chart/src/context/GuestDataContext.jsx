import { createContext, useState } from "react";

export const GuestDataContext = createContext();

export const GuestDataProvider = ({ children }) => {
  const [guests, setGuests] = useState([]);

  return (
    <GuestDataContext.Provider value={{ guests, setGuests }}>
      {children}
    </GuestDataContext.Provider>
  );
};
