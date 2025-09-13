// src/store/slices/authSlice.ts
import {
    createSlice,
    createAsyncThunk,
    type PayloadAction,
} from "@reduxjs/toolkit";
import { LOGIN, getAccessToken } from "../../requests/auth";

type User = { email: string }; // adjust to your backend response
type AuthState = {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
};

const initialState: AuthState = {
    user: null,
    token: getAccessToken(), // read from localStorage on load
    isAuthenticated: !!getAccessToken(),
    loading: false,
    error: null,
};

// Async thunk for login
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (
        credentials: { email: string; password: string },
        { rejectWithValue }
    ) => {
        try {
            const res = await LOGIN(credentials);
            if (res.status === "failed") {
                return rejectWithValue(res.message || "Login failed");
            }
            return res; // expected { response: { accessToken, user? }, ... }
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem("accessToken");
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                loginUser.fulfilled,
                (
                    state,
                    action: PayloadAction<
                        any,
                        string,
                        { arg: { email: string; password: string } },
                        never
                    >
                ) => {
                    state.loading = false;
                    state.error = null;
                    state.isAuthenticated = true;
                    state.token = action.payload.response.accessToken;
                    state.user = { email: action.meta.arg.email }; // adjust if backend sends user
                }
            )
            .addCase(
                loginUser.rejected,
                (
                    state,
                    action: PayloadAction<
                        any,
                        string,
                        { arg: { email: string; password: string } },
                        never
                    >
                ) => {
                    state.loading = false;
                    state.error = action.payload || "Login failed";
                }
            );
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
