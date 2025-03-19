import { createContext, useState } from "react";

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [latitude, setLat] = useState("");
  const [longitude, setLon] = useState("");

  return (
    <LocationContext.Provider value={{ latitude, setLat, longitude, setLon }}>
      {children}
    </LocationContext.Provider>
  );
};
