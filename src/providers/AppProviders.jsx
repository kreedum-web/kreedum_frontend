import QueryProvider from "./QueryProvider";

import {
  AuthProvider,
  CartProvider,
  WishlistProvider,
} from "@/contexts";

export default function AppProviders({ children }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>{children}</WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </QueryProvider>
  );
}