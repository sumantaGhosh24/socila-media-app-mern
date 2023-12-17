import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

import {Loading} from "../components";
import {forgotPassword, reset} from "../features/auth/authSlice";
import {useAuth, useTitle} from "../hooks";

const ForgotPassword = () => {
  useTitle("Forgot Password");

  const [email, setEmail] = useState("");

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
      setEmail("");
      navigate("/confirm-forgot-password");
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword({email}));
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="flex items-center justify-center bg-gray-100 h-screen">
        <div className="mx-auto my-10 w-full max-w-[80%] overflow-hidden rounded-md bg-white px-10 py-10 shadow-md sm:rounded-lg">
          <h2 className="mb-6 text-center text-3xl font-bold">
            Forgot Password
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="mb-2 block font-bold text-gray-700"
              >
                Email:{" "}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                onChange={handleChange}
                value={email}
                className="form-input w-full rounded px-1 py-2 border-4 border-solid border-blue-400 focus:outline-none focus:ring-4"
                placeholder="Enter your email address"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600 focus:outline-none"
              >
                Forgot Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
