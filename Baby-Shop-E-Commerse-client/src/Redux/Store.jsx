import { configureStore } from '@reduxjs/toolkit';
import shopReducer from './ShopSlice';
import authReducer from './AuthSlice';
import orderReducer from './OrderSlice'

const store = configureStore({
  reducer: {
    shop: shopReducer,
    auth: authReducer,
    order: orderReducer, 
  },
});

export default store;
