import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load cart on login or mount
  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem('token');
      if (user && token) {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/cart`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            }
          });
          if (response.ok) {
            const result = await response.json();
            const rawItems = result.data || [];
            // Transform back-end structure to front-end (product details are usually nested)
            const items = rawItems.map(item => ({
              ...item.product,
              cart_item_id: item.id, // the ID of the cart_item record
              qty: item.quantity
            }));
            setCartItems(items);
          }
        } catch (error) {
          console.error('Failed to fetch cart:', error);
        }
      } else {
        // Load from local storage for guests
        const local = localStorage.getItem('cart');
        setCartItems(local ? JSON.parse(local) : []);
      }
      setLoading(false);
    };

    fetchCart();
  }, [user]);

  // Sync local storage for guests
  useEffect(() => {
    if (!user) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const addToCart = async (product, qty = 1) => {
    const token = localStorage.getItem('token');
    if (user && token) {
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/cart`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ product_id: product.id, quantity: qty })
        });
        // Refresh local state
        refreshCart();
      } catch (error) {
        console.error('Failed to add to cart:', error);
      }
    } else {
      setCartItems(prev => {
        const existing = prev.find(i => i.id === product.id);
        if (existing) {
          return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i);
        }
        return [...prev, { ...product, qty }];
      });
    }
  };

  const removeFromCart = async (id) => {
    const token = localStorage.getItem('token');
    // If id is numeric and user is logged in, it's likely a database id
    if (user && token) {
      // We need to find the cart_item_id for this product
      const item = cartItems.find(i => i.id === id);
      if (item && item.cart_item_id) {
        try {
          await fetch(`${import.meta.env.VITE_API_URL}/cart/${item.cart_item_id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            }
          });
          refreshCart();
        } catch (error) {
          console.error('Failed to remove from cart:', error);
        }
        return;
      }
    }
    setCartItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQty = async (id, qty) => {
    if (qty < 1) return removeFromCart(id);
    
    const token = localStorage.getItem('token');
    if (user && token) {
      const item = cartItems.find(i => i.id === id);
      if (item && item.cart_item_id) {
        try {
          await fetch(`${import.meta.env.VITE_API_URL}/cart/${item.cart_item_id}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({ quantity: qty })
          });
          refreshCart();
        } catch (error) {
          console.error('Failed to update qty:', error);
        }
        return;
      }
    }
    setCartItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  };

  const refreshCart = async () => {
    const token = localStorage.getItem('token');
    if (user && token) {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/cart`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      if (response.ok) {
        const result = await response.json();
        const rawItems = result.data || [];
        const items = rawItems.map(item => ({
          ...item.product,
          cart_item_id: item.id,
          qty: item.quantity
        }));
        setCartItems(items);
      }
    }
  };

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQty, clearCart, cartCount, cartTotal, loading }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
