import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";

import messageService from "./messageService";

const initialState = {
  messages: [],
  conversation: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const createMessage = createAsyncThunk(
  "message/createMessage",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.accessToken;
      return await messageService.createMessage(data, token);
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

export const getConversations = createAsyncThunk(
  "message/getConversations",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.accessToken;
      return await messageService.getConversations(data, token);
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

export const getMessages = createAsyncThunk(
  "message/getMessages",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.accessToken;
      return await messageService.getMessages(data.id, data.search, token);
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

export const deleteMessages = createAsyncThunk(
  "message/deleteMessages",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.accessToken;
      return await messageService.deleteMessages(data, token);
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

export const deleteConversation = createAsyncThunk(
  "message/deleteConversation",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.accessToken;
      return await messageService.deleteConversation(data, token);
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

export const messageSlice = createSlice({
  name: "message",
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
      .addCase(createMessage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
      })
      .addCase(createMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getConversations.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getConversations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.conversation = action.payload;
      })
      .addCase(getConversations.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getMessages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages = action.payload;
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteMessages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
      })
      .addCase(deleteMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteConversation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteConversation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
      })
      .addCase(deleteConversation.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const {reset} = messageSlice.actions;
export default messageSlice.reducer;
