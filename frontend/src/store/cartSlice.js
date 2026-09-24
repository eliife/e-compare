import { createSlice } from '@reduxjs/toolkit';

// Daha önceden localStorage'da sepet varsa onu alalım
const localCart = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('cart')) : [];

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: localCart || [],
  },
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const productId = product._id || product.id;
      
      // Ürün zaten sepette mi ekli kontrol edelim
      const existingItem = state.items.find((item) => (item._id || item.id) === productId);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }

      // localStorage'a kaydedelim
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    decreaseQuantity: (state, action) => {
      const productId = action.payload;
      const existingItem = state.items.find((item) => (item._id || item.id) === productId);

      if (existingItem) {
        if (existingItem.quantity > 1) {
          existingItem.quantity -= 1;
        } else {
          // Adet 1 ise ve kullanıcı azaltmaya basarsa ürünü tamamen sepetten çıkaralım
          state.items = state.items.filter((item) => (item._id || item.id) !== productId);
        }
      }

      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => (item._id || item.id) !== productId);
      
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('cart');
    },
  },
});

export const { addToCart, decreaseQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;