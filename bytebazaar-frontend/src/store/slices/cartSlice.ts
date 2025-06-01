import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { Project } from './projectSlice';

export interface CartItem {
  projectId: string;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  total: 0,
  loading: false,
  error: null
};

// Helper function to calculate total
const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Project>) => {
      const { _id, title, price, thumbnail } = action.payload;
      const existingItem = state.items.find(item => item.projectId === _id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          projectId: _id,
          title,
          price,
          thumbnail,
          quantity: 1
        });
      }
      
      state.total = calculateTotal(state.items);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.projectId !== action.payload);
      state.total = calculateTotal(state.items);
    },
    updateQuantity: (state, action: PayloadAction<{ projectId: string; quantity: number }>) => {
      const { projectId, quantity } = action.payload;
      const item = state.items.find(item => item.projectId === projectId);
      
      if (item) {
        item.quantity = Math.max(0, quantity);
        if (item.quantity === 0) {
          state.items = state.items.filter(i => i.projectId !== projectId);
        }
      }
      
      state.total = calculateTotal(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

// Selectors
export const selectCartItems = (state: RootState) => (state.cart as CartState).items;
export const selectCartTotal = (state: RootState) => (state.cart as CartState).total;
export const selectCartLoading = (state: RootState) => (state.cart as CartState).loading;
export const selectCartError = (state: RootState) => (state.cart as CartState).error;
export const selectCartItemCount = (state: RootState) => 
  (state.cart as CartState).items.reduce((sum, item) => sum + item.quantity, 0);

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setLoading,
  setError
} = cartSlice.actions;

export default cartSlice.reducer;
