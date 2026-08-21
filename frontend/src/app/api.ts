import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import type { RootState } from './store'
import { setCredentials, logout } from '../features/auth/authSlice'

interface AuthResponse {
  accessToken: string
}

interface User {
  id: string
  name: string
  email: string
  systemRole: string
}

interface MeResponse {
  userId: string
  email: string
  role: string
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3000',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  },
})

// Wraps the base query with a single 401 -> refresh -> retry cycle.
// The refresh call itself always goes through `rawBaseQuery` directly (never
// through this wrapper), so there is no code path that can trigger a second
// refresh attempt from within a refresh attempt - the recursion is
// structurally impossible, not just guarded by a flag.
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const isRefreshCall =
    typeof args !== 'string' && args.url === 'auth/refresh'

  let result = await rawBaseQuery(args, api, extraOptions)

  if (result.error?.status === 401 && !isRefreshCall) {
    const refreshResult = await rawBaseQuery(
      { url: 'auth/refresh', method: 'POST' },
      api,
      extraOptions,
    )

    if (refreshResult.data) {
      api.dispatch(
        setCredentials({
          accessToken: (refreshResult.data as AuthResponse).accessToken,
        }),
      )
      result = await rawBaseQuery(args, api, extraOptions)
    } else {
      api.dispatch(logout())
    }
  }

  return result
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getHealth: builder.query<{ status: string }, void>({
      query: () => 'health',
    }),
    register: builder.mutation<
      User,
      { name: string; email: string; password: string }
    >({
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
        const { data: tokens } = await queryFulfilled

        dispatch(setCredentials({ ...tokens }))

        const meResult = await dispatch(api.endpoints.getMe.initiate())
        if ('data' in meResult && meResult.data) {
          dispatch(
            setCredentials({
              ...tokens,
              user: {
                id: meResult.data.userId,
                email: meResult.data.email,
                systemRole: meResult.data.role,
                name: '',
              },
            }),
          )
        }
      },
    }),
    getMe: builder.query<MeResponse, void>({
      query: () => 'auth/me',
    }),
    refresh: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: 'auth/refresh',
        method: 'POST',
      }),
    }),
  }),
})

export const {
  useGetHealthQuery,
  useRegisterMutation,
  useLoginMutation,
  useGetMeQuery,
  useRefreshMutation,
} = api