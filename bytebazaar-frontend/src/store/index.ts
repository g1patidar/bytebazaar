import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import projectReducer, { ProjectState } from './slices/projectSlice';
import categoryReducer from './slices/categorySlice';
import authReducer from './slices/authSlice';
import cartReducer, { CartState } from './slices/cartSlice';
import { persistStore, persistReducer, PersistConfig } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { setAuthStore } from '@/api/axios';

// Define the persisted state types
type AuthPersistedState = {
  token: string | null;
  user: any;
};

type CartPersistedState = {
  items: CartState['items'];
};

// Configure persist for each reducer
const authPersistConfig: PersistConfig<any> = {
  key: 'auth',
  storage,
  whitelist: ['token', 'user']
};

const cartPersistConfig: PersistConfig<CartState> = {
  key: 'cart',
  storage,
  whitelist: ['items']
};

// Create the persisted reducers
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);

// Configure the store
export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    cart: persistedCartReducer,
    project: projectReducer,
    category: categoryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Initialize axios interceptors with the store
setAuthStore(store);

export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
