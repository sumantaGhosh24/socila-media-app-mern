import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";

import postService from "./postService";

const initialState = {
  posts: [],
  post: {},
  userPosts: [],
  discoverPosts: [],
  savePosts: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const createPost = createAsyncThunk(
  "post/createPost",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.accessToken;
      return await postService.createPost(data, token);
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

export const getPosts = createAsyncThunk(
  "post/getPosts",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.accessToken;
      return await postService.getPosts(data.search, token);
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

export const getPost = createAsyncThunk(
  "post/getPost",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.accessToken;
      return await postService.getPost(data, token);
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

export const deletePost = createAsyncThunk(
  "post/deletePost",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.accessToken;
      return await postService.deletePost(data, token);
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

export const likePost = createAsyncThunk(
  "post/likePost",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.accessToken;
      return await postService.likePost(data.id, token);
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

export const unLikePost = createAsyncThunk(
  "post/unLikePost",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.accessToken;
      return await postService.unLikePost(data.id, token);
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

export const getUserPosts = createAsyncThunk(
  "post/getUserPosts",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.accessToken;
      return await postService.getUserPosts(data.id, data.limit, token);
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

export const getPostsDiscover = createAsyncThunk(
  "post/getPostsDiscover",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.accessToken;
      return await postService.getPostsDiscover(data.search, token);
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

export const savePost = createAsyncThunk(
  "post/savePost",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.accessToken;
      return await postService.savePost(data.id, token);
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

export const unSavePost = createAsyncThunk(
  "post/unSavePost",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.accessToken;
      return await postService.unSavePost(data.id, token);
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

export const getSavePosts = createAsyncThunk(
  "post/getSavePosts",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.accessToken;
      return await postService.getSavePosts(data.limit, token);
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

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
      state.userPosts = [];
      state.savePosts = [];
      state.discoverPosts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getPosts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload;
      })
      .addCase(getPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getPost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.post = action.payload;
      })
      .addCase(getPost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deletePost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(likePost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(likePost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
      })
      .addCase(likePost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(unLikePost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(unLikePost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
      })
      .addCase(unLikePost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getUserPosts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userPosts = action.payload;
      })
      .addCase(getUserPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getPostsDiscover.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPostsDiscover.fulfilled, (state, action) => {
        state.isLoading = false;
        state.discoverPosts = action.payload;
      })
      .addCase(getPostsDiscover.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(savePost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(savePost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
      })
      .addCase(savePost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(unSavePost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(unSavePost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
      })
      .addCase(unSavePost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getSavePosts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSavePosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.savePosts = action.payload;
      })
      .addCase(getSavePosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const {reset} = postSlice.actions;
export default postSlice.reducer;
