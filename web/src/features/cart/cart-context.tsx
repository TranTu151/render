"use client";
import { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";
import type { CartAction, CartState } from "@/types/cart";

const LS_KEY = "shoply:cart";

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const idx = state.items.findIndex((it) => it.productId === action.payload.productId);
      if (idx >= 0) {
        const next = [...state.items];
        const cur = next[idx];
        next[idx] = { ...cur, quantity: cur.quantity + action.payload.quantity };
        return { items: next };
      }
      return { items: [...state.items, action.payload] };
    }
    case "REMOVE":
      return { items: state.items.filter((it) => it.productId !== action.payload.productId) };
    case "SET_QTY":
      return {
        items: state.items.map((it) =>
          it.productId === action.payload.productId
            ? { ...it, quantity: Math.max(1, action.payload.quantity) }
            : it
        ),
      };
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

function loadInitial(): CartState {
  if (typeof window === "undefined") return { items: [] };
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as CartState) : { items: [] };
  } catch {
    return { items: [] };
  }
}

const CartCtx = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  totalItems: number;
  subtotal: number;
  hydrated: boolean;
} | null>(null);

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [state, dispatch] = useReducer(reducer, undefined, loadInitial);

  useEffect(() => {
    window.localStorage.setItem(LS_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => setHydrated(true), []);

  const totalItems = useMemo(() => state.items.reduce((s, it) => s + it.quantity, 0), [state.items]);
  const subtotal = useMemo(() => state.items.reduce((s, it) => s + it.price * it.quantity, 0), [state.items]);

  const value = useMemo(() => ({ state, dispatch, totalItems, subtotal, hydrated }), [state, totalItems, subtotal, hydrated]);
  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}