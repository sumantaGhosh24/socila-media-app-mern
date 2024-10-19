import {configureStore} from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import userReducer from "../features/user/userSlice";
import postReducer from "../features/post/postSlice";
import commentReducer from "../features/comment/commentSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    comment: commentReducer,
    post: postReducer,
    user: userReducer,
  },
});
