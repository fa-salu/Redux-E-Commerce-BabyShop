import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const placeOrder = createAsyncThunk(
  'order/placeOrder',
  async ({ userId, name, place, phone, address, token }) => {
    const response = await fetch('/users/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, name, place, phone, address }),
    });
    return response.json();
  }
);

export const verifyPayment = createAsyncThunk(
  'order/verifyPayment',
  async ({ paymentData, token }) => {
    const response = await fetch('/users/order/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(paymentData),
    });
    return response.json();
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState: { status: null, orderData: null },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.orderData = action.payload;
      })
      .addCase(verifyPayment.fulfilled, (state) => {
        state.status = 'verified';
      });
  },
});

export default orderSlice.reducer;
