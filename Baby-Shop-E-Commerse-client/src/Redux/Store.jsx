import { configureStore } from '@reduxjs/toolkit';
import shopReducer from './ShopSlice';

const store = configureStore({
  reducer: {
    shop: shopReducer,
  },
});

export default store;
