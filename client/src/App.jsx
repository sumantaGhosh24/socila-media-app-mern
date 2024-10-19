import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {ToastContainer} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import {GuestAuth, Header, UserAuth} from "./components";
import {
  ConfirmForgotPassword,
  Discover,
  ForgotPassword,
  Home,
  Login,
  LoginVerify,
  Logout,
  NotFound,
  Post,
  Profile,
  Register,
  RegisterVerify,
} from "./pages";
import {generateAccessToken} from "./features/auth/authSlice";
import {getPosts} from "./features/post/postSlice";
import {suggestionsUser} from "./features/user/userSlice";
import {useAuth} from "./hooks";

function App() {
  const {user} = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(generateAccessToken());
  }, [dispatch]);

  useEffect(() => {
    if (user?.accessToken) {
      dispatch(getPosts());
      dispatch(suggestionsUser());
    }
  }, [dispatch, user?.accessToken]);

  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        {user?.accessToken && <Header />}
        <Routes>
          <Route path="/register" element={<GuestAuth elm={<Register />} />} />
          <Route
            path="/register-verify"
            element={<GuestAuth elm={<RegisterVerify />} />}
          />
          <Route path="/login" element={<GuestAuth elm={<Login />} />} />
          <Route
            path="/login-verify"
            element={<GuestAuth elm={<LoginVerify />} />}
          />
          <Route
            path="/forgot-password"
            element={<GuestAuth elm={<ForgotPassword />} />}
          />
          <Route
            path="/confirm-forgot-password"
            element={<GuestAuth elm={<ConfirmForgotPassword />} />}
          />
          <Route path="/logout" element={<Logout />} />
          <Route path="/" element={<UserAuth elm={<Home />} />} />
          <Route path="/profile/:id" element={<UserAuth elm={<Profile />} />} />
          <Route path="/discover" element={<UserAuth elm={<Discover />} />} />
          <Route path="/post/:id" element={<UserAuth elm={<Post />} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
