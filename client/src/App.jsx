import {useEffect} from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import {useDispatch} from "react-redux";
import "react-toastify/dist/ReactToastify.css";

import {
  Register,
  Discover,
  Home,
  Login,
  Message,
  Post,
  Profile,
  NotFound,
  RegisterVerify,
  LoginVerify,
  Logout,
  ForgotPassword,
  ConfirmForgotPassword,
} from "./pages";
import {Header, UserAuth, GuestAuth} from "./components";
import {useAuth} from "./hooks";
import {generateAccessToken} from "./features/auth/authSlice";
import {getNotifies} from "./features/notify/notifySlice";
import {getPosts} from "./features/post/postSlice";
import {suggestionsUser} from "./features/user/userSlice";

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
      dispatch(getNotifies());
    }
  }, [dispatch, user?.accessToken]);

  useEffect(() => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
      console.log("permission granted");
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {
          console.log("permission granted");
        }
      });
    }
  }, []);

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

          {/* not completed */}

          <Route path="/" element={<UserAuth elm={<Home />} />} />
          <Route path="/profile/:id" element={<UserAuth elm={<Profile />} />} />
          <Route path="/discover" element={<UserAuth elm={<Discover />} />} />
          <Route path="/post/:id" element={<UserAuth elm={<Post />} />} />
          <Route path="/message" element={<UserAuth elm={<Message />} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
