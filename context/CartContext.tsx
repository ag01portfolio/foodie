
import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { CartItem, ApiMealSummary } from '../types';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: ApiMealSummary, price: number) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: ApiMealSummary, price: number) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.idMeal === item.idMeal);
      if (existingItem) {
        return prevItems.map(cartItem =>
          cartItem.idMeal === item.idMeal
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevItems, { ...item, price, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.idMeal === itemId ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.idMeal !== itemId));
  };

  const totalItems = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const totalPrice = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  const value = useMemo(() => ({
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    totalItems,
    totalPrice
  }), [cartItems]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
