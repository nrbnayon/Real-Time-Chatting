import { configureStore } from "@reduxjs/toolkit";
import todosReducer from "../features/todosSlice";
import { todosApi } from "../services/todosApi";
import { apiSlice } from "../services/apiSlice";

export const store = configureStore({
  reducer: {
    todos: todosReducer,
    [todosApi.reducerPath]: todosApi.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(todosApi.middleware, apiSlice.middleware),
});
