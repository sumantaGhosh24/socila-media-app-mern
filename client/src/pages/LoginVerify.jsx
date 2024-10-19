import {useState, useEffect} from "react";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

import {loginVerify, reset} from "../features/auth/authSlice";
import {useAuth, useTitle} from "../hooks";

const LoginVerify = () => {
  useTitle("Login Verify");

  const [otp, setOtp] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {user, isLoading, isError, isSuccess, message} = useAuth();

  useEffect(() => {
    if (isError) {
      toast.error(typeof message === "object" ? message.message : message, {
        toastId: "login-error",
      });
    }
    if (isSuccess) {
      toast.success(typeof message === "object" ? message.message : message, {
        toastId: "login-success",
      });
      navigate("/");
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginVerify({otp}));
  };

  return (
    <>
      <div className="flex h-screen items-center justify-center bg-gray-200">
        <div className="container mx-auto text-center rounded-lg bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-center text-3xl font-bold">Login Verify</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="otp"
                className="mb-2 block font-bold text-gray-700 text-left"
              >
                Otp:{" "}
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                onChange={(e) => setOtp(e.target.value)}
                value={otp}
                className="form-input w-full rounded px-1 py-2 focus:outline-none focus:ring-4 border-4 border-solid border-blue-400"
                placeholder="Enter your otp"
              />
            </div>
            <div className="flex items-center">
              <button
                type="submit"
                className="focus:shadow-outline founded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600 disabled:bg-blue-200 focus:outline-none"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Verify Login"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginVerify;
