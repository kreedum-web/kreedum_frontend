import { createContext, useContext, useState } from "react";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlistCount, setWishlistCount] = useState(0);

  return (
    <WishlistContext.Provider value={{ wishlistCount, setWishlistCount }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);