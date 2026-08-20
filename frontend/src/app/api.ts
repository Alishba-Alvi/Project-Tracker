import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  systemRole: string;
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000' }),
  endpoints: (builder) => ({
    getHealth: builder.query<{ status: string }, void>({
      query: () => 'health',
    }),
    register: builder.mutation<User, { name: string; email: string; password: string }>({
      query: (body) => ({
        url: 'auth/register',
        method: 'POST',
        body,
      }),
    }),
    login: builder.mutation<AuthResponse, { email: string; password: string }>({
      query: (body) => ({
        url: 'auth/login',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useGetHealthQuery, useRegisterMutation, useLoginMutation } = api;