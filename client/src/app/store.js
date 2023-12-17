import {configureStore} from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import commentReducer from "../features/comment/commentSlice";
import messageReducer from "../features/message/messageSlice";
import notifyReducer from "../features/notify/notifySlice";
import postReducer from "../features/post/postSlice";
import userReducer from "../features/user/userSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    comment: commentReducer,
    message: messageReducer,
    notify: notifyReducer,
    post: postReducer,
    user: userReducer,
  },
});
