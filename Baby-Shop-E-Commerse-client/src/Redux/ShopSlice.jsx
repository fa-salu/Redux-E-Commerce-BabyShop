import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  products: [],
  cartItems: [],
  wishlistItems: [],
  currentUser: null,
  search: "",
  status: "idle",
  error: null,
};

export const fetchProductById = createAsyncThunk(
  "shop/fetchProductById",
  async (id) => {
    const response = await fetch(`http://localhost:5000/users/product/${id}`);
    if (!response.ok) throw new Error("Failed to fetch product");
    return response.json();
  }
);

export const fetchRelatedProducts = createAsyncThunk(
  "shop/fetchRelatedProducts",
  async (category) => {
    const response = await fetch(
      `http://localhost:5000/users/products/${category}`
    );
    if (!response.ok) throw new Error("Failed to fetch related products");
    return response.json();
  }
);

export const fetchProducts = createAsyncThunk(
  "shop/fetchProducts",
  async () => {
    const response = await fetch("http://localhost:5000/users/products");
    if (!response.ok) throw new Error("Failed to fetch products");
    return response.json();
  }
);

export const getCartItems = createAsyncThunk(
  "shop/getCartItems",
  async (userId) => {
    const token = Cookies.get("token");
    const response = await fetch(`http://localhost:5000/users/cart/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Failed to fetch cart items");
    return response.json();
  }
);

export const addToCart = createAsyncThunk(
  "shop/addToCart",
  async ({ userId, productId }) => {
    const token = Cookies.get("token");
    const response = await fetch("http://localhost:5000/users/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, productId }),
    });

    if (!response.ok) throw new Error("Failed to add item to cart");
    return getCartItems(userId);
  }
);

export const deleteCartItem = createAsyncThunk(
  "shop/deleteCartItem",
  async ({ userId, productId }) => {
    const token = Cookies.get("token");
    await fetch(
      `http://localhost:5000/users/cart/delete/${userId}/${productId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return getCartItems(userId);
  }
);

export const removeCartItem = createAsyncThunk(
  "shop/removeCartItem",
  async ({ userId, productId }) => {
    const token = Cookies.get("token");
    await fetch(
      `http://localhost:5000/users/cart/remove/${userId}/${productId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return getCartItems(userId);
  }
);

// Async thunk for adding to wishlist
export const addToWishlist = createAsyncThunk(
  "shop/addToWishlist",
  async ({ userId, productId }) => {
    const token = Cookies.get("token");
    const response = await fetch("http://localhost:5000/users/wishlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, productId }),
    });

    if (!response.ok) throw new Error("Failed to add item to wishlist");
    return response.json();
  }
);

export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (userId, thunkAPI) => {
    const response = await fetch(`/cart/${userId}`);
    return response.json();
  }
);

const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    logout: (state) => {
      state.currentUser = null;
      state.cartItems = [];
      Cookies.remove("currentUser");
      Cookies.remove("token");
    },
    clearCart: (state) => {
      state.items = [];
      state.totalPrice = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.product = action.payload;
      })
      .addCase(fetchRelatedProducts.fulfilled, (state, action) => {
        state.relatedProducts = action.payload.filter(
          (item) => item._id !== action.meta.arg
        );
      })
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(getCartItems.fulfilled, (state, action) => {
        state.cartItems = action.payload;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cartItems = action.payload;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.cartItems = action.payload;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.wishlistItems = action.payload.wishlist.products;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.items = action.payload;
        state.totalPrice = action.payload
          .reduce((sum, item) => sum + item.productId.price * item.quantity, 0)
          .addCase(deleteCartItem.fulfilled, (state, action) => {
            state.cartItems = action.payload;
          });
      });
  },
});

export const { setSearch, setCurrentUser, logout, clearCart } =
  shopSlice.actions;

export const getFilteredProducts = (state) => {
  const searchTerm = state.shop.search.toLowerCase();
  return state.shop.products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm)
  );
};

export const selectShop = (state) => state.shop;

export default shopSlice.reducer;
