import {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {toast} from "react-toastify";
import {FaEye, FaEyeSlash} from "react-icons/fa";

import {useAuth, useTitle} from "../hooks";
import {login, reset} from "../features/auth/authSlice";
import {Loading} from "../components";

const Login = () => {
  useTitle("Login User");

  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const [typePass, setTypePass] = useState(false);

  const {email, password} = userData;

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
      setUserData({
        email: "",
        password: "",
      });
      navigate("/login-verify");
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const handleChange = (e) => {
    const {name, value} = e.target;
    setUserData({...userData, [name]: value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(userData));
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="flex items-center justify-center bg-gray-100 h-[100vh]">
        <div className="mx-auto my-10 w-full max-w-[80%] overflow-hidden rounded-md bg-white px-10 py-10 shadow-md sm:rounded-lg">
          <h2 className="mb-6 text-center text-3xl font-bold">Login Form</h2>
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
                className="form-input w-full rounded px-1 py-2 focus:outline-none focus:ring-4 border-4 border-solid border-blue-400"
                placeholder="Enter your email address"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="mb-2 block font-bold text-gray-700"
              >
                Password:{" "}
              </label>
              <div className="relative">
                <input
                  type={typePass ? "text" : "password"}
                  id="password"
                  name="password"
                  onChange={handleChange}
                  value={password}
                  className="form-input w-full rounded px-1 py-2 pr-10 focus:outline-none focus:ring-4 border-4 border-solid border-blue-400"
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
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600 focus:outline-none"
              >
                Login
              </button>
              <p className="font-bold">
                Don&apos;t have an account?{" "}
                <Link
                  to="/register"
                  className="text-blue-500 hover:text-blue-700 hover:underline"
                >
                  Register
                </Link>
              </p>
            </div>
            <div className="mt-6">
              <p className="text-center font-bold">
                Don&apos;t remember your password?{" "}
                <Link
                  to="/forgot-password"
                  className="text-blue-500 hover:text-blue-700 hover:underline"
                >
                  Forgot Password
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
