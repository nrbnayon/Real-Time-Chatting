import { apiSlice } from "@/redux/services/apiSlice";

export const dynamicTypeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    dynamicTypes: builder.query({
      query: ({ dynamicApi, id }) => {
        // Remove the extra curly brace that was causing the URL issue
        const url = id ? `/api/${dynamicApi}?id=${id}` : `/api/${dynamicApi}`;
        return {
          url,
          method: "GET",
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
          },
        };
      },
    }),
  }),
});

export const { useDynamicTypesQuery } = dynamicTypeApiSlice;
