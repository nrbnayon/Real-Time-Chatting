import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isLoggedIn: false,
  isLoading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = {
        id: action.payload.id,
        role: action.payload.role,
        email: action.payload.email,
        name: action.payload.name,
        token: action.payload.token,
      };
      state.isLoggedIn = true;
      state.isLoading = false;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.isLoading = false;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setCredentials, clearCredentials, setLoading } =
  authSlice.actions;
export default authSlice.reducer;
