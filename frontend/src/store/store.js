import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import cartReducer from './cartSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    // İleride buraya cart: cartReducer, wishlist: wishlistReducer ekleyeceğiz
  },
});