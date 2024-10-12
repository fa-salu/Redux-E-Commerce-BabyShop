import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookie from "js-cookie";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (input, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:5000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      const data = await response.json();
      if (response.ok) {
        Cookie.set("token", data.token);
        if (data.user.isAdmin) {
          Cookie.set("isAdmin", "true");
        } else {
          Cookie.remove("isAdmin");
        }
        Cookie.set("currentUser", JSON.stringify(data.user));
        return data.user;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      return rejectWithValue("An unexpected error occurred. Please try again.");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    currentUser: null,
    error: null,
    loading: false,
  },
  reducers: {
    logout: (state) => {
      state.currentUser = null;
      Cookie.remove("token");
      Cookie.remove("isAdmin");
      Cookie.remove("currentUser");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
