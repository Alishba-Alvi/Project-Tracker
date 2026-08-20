import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000' }),
  endpoints: (builder) => ({
    getHealth: builder.query<{ status: string }, void>({
      query: () => 'health',
    }),
  }),
});

export const { useGetHealthQuery } = api;