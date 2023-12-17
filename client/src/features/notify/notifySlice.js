import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";

import notifyService from "./notifyService";

const initialState = {
  notify: [],
  readNotify: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const createNotify = createAsyncThunk(
  "notify/createNotify",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.accessToken;
      return await notifyService.createNotify(data, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const removeNotify = createAsyncThunk(
  "notify/removeNotify",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.accessToken;
      return await notifyService.removeNotify(data.id, data.url, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getNotifies = createAsyncThunk(
  "notify/getNotifies",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.accessToken;
      return await notifyService.getNotifies(token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const isReadNotify = createAsyncThunk(
  "notify/isReadNotify",
  async (data, thunkAPI) => {
    try {
      return await notifyService.isReadNotify(data);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteAllNotifies = createAsyncThunk(
  "notify/deleteAllNotifies",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.accessToken;
      return await notifyService.deleteAllNotifies(token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const notifySlice = createSlice({
  name: "notify",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNotify.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNotify.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
      })
      .addCase(createNotify.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(removeNotify.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeNotify.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
      })
      .addCase(removeNotify.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getNotifies.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getNotifies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notify = action.payload;
      })
      .addCase(getNotifies.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(isReadNotify.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(isReadNotify.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
      })
      .addCase(isReadNotify.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteAllNotifies.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAllNotifies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
      })
      .addCase(deleteAllNotifies.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const {reset} = notifySlice.actions;
export default notifySlice.reducer;
