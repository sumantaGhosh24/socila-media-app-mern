import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";

import userService from "./userService";

const initialState = {
  searchUsers: [],
  user: {},
  suggestionUsers: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const searchUser = createAsyncThunk(
  "user/searchUser",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.accessToken;
      return await userService.searchUser(data, token);
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

export const getUser = createAsyncThunk(
  "user/getUser",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.accessToken;
      return await userService.getUser(data, token);
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

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.accessToken;
      return await userService.updateUser(data, token);
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

export const follow = createAsyncThunk(
  "user/follow",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.accessToken;
      return await userService.follow(data, token);
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

export const unfollow = createAsyncThunk(
  "user/unfollow",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.accessToken;
      return await userService.unfollow(data, token);
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

export const suggestionsUser = createAsyncThunk(
  "user/suggestionsUser",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.accessToken;
      return await userService.suggestionsUser(token);
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

export const userSlice = createSlice({
  name: "user",
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
      .addCase(searchUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchUsers = action.payload;
      })
      .addCase(searchUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(follow.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(follow.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
      })
      .addCase(follow.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(unfollow.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(unfollow.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
      })
      .addCase(unfollow.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(suggestionsUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(suggestionsUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.suggestionUsers = action.payload;
      })
      .addCase(suggestionsUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const {reset} = userSlice.actions;
export default userSlice.reducer;
