"use client";

import { useLoggedInUserQuery } from "@/redux/features/auth/authApiSlice";
import { setLoading } from "@/redux/features/auth/authSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const { refetch } = useLoggedInUserQuery() || {};

  useEffect(() => {
    const initAuth = async () => {
      try {
        await refetch();
      } catch (error) {
        console.error("Auth initialization failed:", error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    initAuth();
  }, [refetch, dispatch]);

  return children;
}
