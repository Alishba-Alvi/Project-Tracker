import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from './store';
import { setCredentials } from '../features/auth/authSlice';

interface AuthResponse {
  accessToken: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  systemRole: string;
}

interface MeResponse {
  userId: string;
  email: string;
  role: string;
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
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
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const { data: tokens } = await queryFulfilled;

        dispatch(setCredentials({ accessToken: tokens.accessToken }));

        const meResult = await dispatch(api.endpoints.getMe.initiate());
        if ('data' in meResult && meResult.data) {
          dispatch(
            setCredentials({
              accessToken: tokens.accessToken,
              user: {
                id: meResult.data.userId,
                email: meResult.data.email,
                systemRole: meResult.data.role,
                name: '',
              },
            }),
          );
        }
      },
    }),
    getMe: builder.query<MeResponse, void>({
      query: () => 'auth/me',
    }),
    refresh: builder.mutation<{ accessToken: string }, void>({
      query: () => ({
        url: 'auth/refresh',
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useGetHealthQuery,
  useRegisterMutation,
  useLoginMutation,
  useGetMeQuery,
  useRefreshMutation,
} = api;