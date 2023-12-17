import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import {toast} from "react-toastify";
import {FaEye, FaEyeSlash} from "react-icons/fa";

import {useAuth, useTitle} from "../hooks";
import {
  confirmForgotPassword,
  reset,
  validateConfirmForgotPassword,
} from "../features/auth/authSlice";
import {Loading} from "../components";

const ConfirmForgotPassword = () => {
  useTitle("Confirm Forgot Password");

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [cookieToken, setCookieToken] = useState(false);

  const [data, setData] = useState({
    password: "",
    cf_password: "",
  });
  const [typePass, setTypePass] = useState(false);
  const [typeCfPass, setTypeCfPass] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {user, isLoading, isError, isSuccess, message} = useAuth();

  useEffect(() => {
    if (isError) {
      toast.error(typeof message === "object" ? message.message : message, {
        toastId: "forgot-error",
      });
    }
    if (isSuccess) {
      toast.success(typeof message === "object" ? message.message : message, {
        toastId: "forgot-success",
      });
      setCookieToken(true);
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const handleChange = (e) => {
    const {name, value} = e.target;
    setData({...data, [name]: value});
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    dispatch(validateConfirmForgotPassword(token));
  };

  const handleConfirmForgotPassword = (e) => {
    e.preventDefault();
    dispatch(confirmForgotPassword(data));
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      {!cookieToken && !token && (
        <div className="flex h-screen items-center justify-center bg-gray-200">
          <div className="container w-[80%] mx-auto text-center rounded-lg bg-white p-8 shadow-lg">
            <h1 className="mb-6 text-4xl font-bold">Visit you email address</h1>
            <div className="text-2xl">
              <p>
                A forgot password link send to your email account, click the
                link to activate you account.
              </p>
            </div>
          </div>
        </div>
      )}
      {!cookieToken && token && (
        <div className="flex h-screen items-center justify-center bg-gray-200">
          <div className="container w-[80%] mx-auto text-center rounded-lg bg-white p-8 shadow-lg">
            <h1 className="mb-6 text-4xl font-bold">
              Click the below link to forgot your password
            </h1>
            <button
              className="mb-6 rounded-full bg-blue-500 px-8 py-4 font-bold text-white hover:bg-blue-700 text-xl"
              onClick={handleForgotPassword}
            >
              Click Me
            </button>
            <div className="text-2xl">
              <p>
                After clicking this button you can add a new password to your
                account.
              </p>
            </div>
          </div>
        </div>
      )}
      {cookieToken && (
        <div className="flex h-screen items-center justify-center bg-gray-200">
          <div className="container w-[80%] mx-auto text-center rounded-lg bg-white p-8 shadow-lg">
            <h1 className="mb-6 text-4xl font-bold">Add New Password</h1>
            <form onSubmit={handleConfirmForgotPassword}>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="mb-2 block font-bold text-gray-700 text-left"
                >
                  Password:
                </label>
                <div className="relative">
                  <input
                    type={typePass ? "text" : "password"}
                    id="password"
                    name="password"
                    onChange={handleChange}
                    value={data.password}
                    className="form-input w-full rounded px-1 py-2 pr-10 border-4 border-solid border-blue-400 focus:outline-none focus:ring-4"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-2 text-gray-500 focus:outline-none"
                    id="togglePassword"
                    onClick={() => setTypePass(!typePass)}
                  >
                    {typePass ? (
                      <FaEyeSlash size={32} color="#2563eb" />
                    ) : (
                      <FaEye size={32} color="#2563eb" />
                    )}
                  </button>
                </div>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="cf_password"
                  className="mb-2 block font-bold text-gray-700 text-left"
                >
                  Confirm Password:
                </label>
                <div className="relative">
                  <input
                    type={typeCfPass ? "text" : "password"}
                    id="cf_password"
                    name="cf_password"
                    className="form-input w-full rounded px-1 py-2 pr-10 border-4 border-solid border-blue-400 focus:outline-none focus:ring-4"
                    onChange={handleChange}
                    value={data.cf_password}
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-2 text-gray-500 focus:outline-none"
                    id="toggleCF_password"
                    onClick={() => setTypeCfPass(!typeCfPass)}
                  >
                    {typeCfPass ? (
                      <FaEyeSlash size={32} color="#2563eb" />
                    ) : (
                      <FaEye size={32} color="#2563eb" />
                    )}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600 focus:outline-none"
              >
                Change Password
              </button>
            </form>
            <div className="mt-6">
              <p className="text-center font-bold">
                Now login?{" "}
                <Link
                  to="/login"
                  className="text-blue-500 hover:text-blue-700 hover:underline"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfirmForgotPassword;
