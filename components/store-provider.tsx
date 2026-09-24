"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem, Product } from "../types/catalog";

const CartContext = createContext<{
  items: CartItem[];
  addToCart: (product: Product, size?: string, color?: string) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  orderOpen: boolean;
  setOrderOpen: (open: boolean) => void;
  dark: boolean;
  toggleTheme: () => void;
} | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("maaro-cart");
      const savedTheme = localStorage.getItem("maaro-theme");
      if (savedCart) setItems(JSON.parse(savedCart));
      if (savedTheme === "dark") setDark(true);
    } catch {
      // Browser storage may be unavailable in private contexts; the store still works in-memory.
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("maaro-cart", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("maaro-theme", dark ? "dark" : "light");
  }, [dark]);

  const value = useMemo(
    () => ({
      items,
      addToCart: (product: Product, size = product.sizes[0], color = product.colors[0]) => {
        setItems((current) => {
          const existing = current.find(
            (item) => item.product.id === product.id && item.size === size && item.color === color,
          );
          if (existing) {
            return current.map((item) =>
              item.product.id === product.id && item.size === size && item.color === color
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            );
          }
          return [...current, { product, quantity: 1, size, color }];
        });
        setCartOpen(true);
      },
      removeFromCart: (productId: string, size: string, color: string) => {
        setItems((current) => current.filter((item) => !(item.product.id === productId && item.size === size && item.color === color)));
      },
      updateQuantity: (productId: string, size: string, color: string, quantity: number) => {
        if (quantity <= 0) {
          setItems((current) => current.filter((item) => !(item.product.id === productId && item.size === size && item.color === color)));
          return;
        }
        setItems((current) =>
          current.map((item) =>
            item.product.id === productId && item.size === size && item.color === color
              ? { ...item, quantity }
              : item,
          ),
        );
      },
      clearCart: () => setItems([]),
      cartOpen,
      setCartOpen,
      orderOpen,
      setOrderOpen,
      dark,
      toggleTheme: () => setDark((current) => !current),
    }),
    [items, cartOpen, orderOpen, dark],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useStore() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
