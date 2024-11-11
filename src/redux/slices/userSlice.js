import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { message } from "antd";

const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;

const getToken = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return user?.access_token ? `Bearer ${user.access_token}` : "";
};

const createAxiosInstance = () => {
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      "Cache-Control": "no-cache",
      "Content-Type": "application/json",
      Authorization: getToken(),
    },
  });
};

const handleResponseError = async (error) => {
  const originalRequest = error.config;
  if (error.response?.status === 401 && !originalRequest._retry) {
    if (originalRequest.url.includes("login")) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    try {
      const token = JSON.parse(localStorage.getItem("user") || "{}");
      const response = await server.post("/auth/token", {
        grant_type: "refresh_token",
        refresh_token: token.refresh_token,
      });
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      user.access_token = response.data.access_token;
      localStorage.setItem("user", JSON.stringify(user));
      originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
      return server(originalRequest);
    } catch (err) {
      return Promise.reject(err);
    }
  }
  return Promise.reject(error);
};

const server = createAxiosInstance();

server.interceptors.response.use((response) => response, handleResponseError);

const initialState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  loading: false,
  error: null,
};

export const login = createAsyncThunk("user/login", async (values, { rejectWithValue }) => {
  try {
    const { data: auth } = await server.post("/auth/client/login", values);
    const { data: userData } = await server.get("/auth/client/me", {
      headers: { Authorization: `Bearer ${auth.access_token}` },
    });

    const user = {
      ...userData.user,
      ...auth,
    };

    localStorage.setItem("user", JSON.stringify(user));
    return user;
  } catch (error) {
    console.log(error);
    return rejectWithValue(error.response?.data?.error || "Login failed");
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
      localStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        message.error(action.payload);
      });
  },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;
