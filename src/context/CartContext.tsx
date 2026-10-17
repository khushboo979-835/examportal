'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { PDFProduct } from '@/types';

interface CartItem {
  product: PDFProduct;
}

interface CartContextType {
  cart: CartItem[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addToCart: (product: PDFProduct) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  totalAmount: number;
  totalOriginalAmount: number;
  totalSaved: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('exampustak_cart');
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('exampustak_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  const addToCart = (product: PDFProduct) => {
    setCart((prev) => {
      const exists = prev.some((item) => item.product.id === product.id);
      if (exists) return prev;
      return [...prev, { product }];
    });
    setIsOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + (item.product.discountedPrice ?? item.product.price),
    0
  );

  const totalOriginalAmount = cart.reduce((sum, item) => sum + item.product.price, 0);
  const totalSaved = Math.max(0, totalOriginalAmount - totalAmount);

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        setIsOpen,
        addToCart,
        removeFromCart,
        clearCart,
        totalAmount,
        totalOriginalAmount,
        totalSaved,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
