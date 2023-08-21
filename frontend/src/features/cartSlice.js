import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const cartItemsFromStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : [];

const shippingAddressFromStorage = localStorage.getItem('shippingAddress')
  ? JSON.parse(localStorage.getItem('shippingAddress'))
  : {};

const initialState = {
  status: 'idle',
  cart: cartItemsFromStorage,
  shippingAddress: shippingAddressFromStorage,
  paymentMethod: 'PayPal',
  itemsPrice: 0.0,
  shippingPrice: 0.0,
  taxPrice: 0.0,
  totalPrice: 0.0,
};

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ id, qty }) => {
    const { data } = await axios.get(`/api/products/${id}`);
    const newItem = {
      product: data._id,
      name: data.name,
      image: data.image,
      price: data.price,
      countInStock: data.countInStock,
      qty: Number(qty),
    };
    return newItem;
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter((item) => item._id !== action.payload._id);
      return state;
    },
    saveShippingAddress: (state, action) => {
      localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },
    calculatePrices: (state, action) => {
      state.itemsPrice = state.cart.reduce(
        (acc, item) => acc + item.price * item.qty,
        0
      );
      state.shippingPrice = state.itemsPrice < 100 ? 0 : 100;
      state.shippingPrice = Number(state.shippingPrice).toFixed(2);
      state.taxPrice = (state.itemsPrice * 0.15).toFixed(2);
      state.totalPrice = (
        Number(state.itemsPrice) +
        Number(state.shippingPrice) +
        Number(state.taxPrice)
      ).toFixed(2);
    },
    clearCart: (state, action)=> {
      state.cart = {};
    }
  },
  extraReducers(builder) {
    builder
      .addCase(addToCart.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = 'succeeded';

        const id = action.payload.product;
        const isAvailable = state.cart.find((item) => item.product === id);
        if (isAvailable) {
          const updatedItems = state.cart.map((item) =>
            item.product === id ? { ...item, qty: action.payload.qty } : item
          );
          state.cart = updatedItems;
        } else {
          state.cart.push(action.payload);
        }
        localStorage.setItem('cartItems', JSON.stringify(state.cart));
      });
  },
});

export const {
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  calculatePrices,
  clearCart
} = cartSlice.actions;
export default cartSlice.reducer;
