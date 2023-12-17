import {useState, useEffect} from "react";
import {useDispatch} from "react-redux";
import {useNavigate, Link} from "react-router-dom";
import {toast} from "react-toastify";
import {FaEye, FaEyeSlash} from "react-icons/fa";

import {useAuth, useTitle} from "../hooks";
import {reset, register} from "../features/auth/authSlice";
import {Loading} from "../components";

const Register = () => {
  useTitle("Register User");

  const [userData, setUserData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    cf_password: "",
    gender: "male",
  });
  const [typePass, setTypePass] = useState(false);
  const [typeCfPass, setTypeCfPass] = useState(false);

  const {fullname, username, email, password, cf_password} = userData;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {user, isLoading, isError, isSuccess, message} = useAuth();

  useEffect(() => {
    if (isError) {
      toast.error(typeof message === "object" ? message.message : message, {
        toastId: "register-error",
      });
    }
    if (isSuccess) {
      toast.success(typeof message === "object" ? message.message : message, {
        toastId: "register-success",
      });
      setUserData({
        fullname: "",
        username: "",
        email: "",
        password: "",
        cf_password: "",
        gender: "male",
      });
      navigate("/register-verify");
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const handleChange = (e) => {
    const {name, value} = e.target;
    setUserData({...userData, [name]: value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(register(userData));
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="flex items-center justify-center bg-gray-100 h-[100vh]">
        <div className="mx-auto my-10 w-full max-w-[80%] overflow-hidden rounded-md bg-white px-10 py-10 shadow-md sm:rounded-lg">
          <h2 className="mb-6 text-center text-3xl font-bold">
            Registration Form
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="fullname"
                className="mb-2 block font-bold text-gray-700"
              >
                Full Name:
              </label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                onChange={handleChange}
                value={fullname}
                className="form-input w-full rounded px-1 py-2 border-4 border-solid border-blue-400 focus:outline-none focus:ring-4"
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="mb-2 block font-bold text-gray-700"
              >
                Username:
              </label>
              <input
                type="text"
                id="username"
                name="username"
                onChange={handleChange}
                value={username.toLowerCase().replace(/ /g, "")}
                className="form-input w-full rounded px-1 py-2 border-4 border-solid border-blue-400 focus:outline-none focus:ring-4"
                placeholder="Enter a username"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="mb-2 block font-bold text-gray-700"
              >
                Email:
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
            <div className="mb-4">
              <label
                htmlFor="password"
                className="mb-2 block font-bold text-gray-700"
              >
                Password:
              </label>
              <div className="relative">
                <input
                  type={typePass ? "text" : "password"}
                  id="password"
                  name="password"
                  onChange={handleChange}
                  value={password}
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
                className="mb-2 block font-bold text-gray-700"
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
                  value={cf_password}
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
            <div className="mb-4">
              <label className="mb-2 block font-bold text-gray-700">
                Gender:
              </label>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="male"
                  name="gender"
                  value="male"
                  className="form-checkbox mr-2"
                  onChange={handleChange}
                />
                <label htmlFor="male" className="mr-6">
                  Male
                </label>
                <input
                  type="radio"
                  id="female"
                  name="gender"
                  value="female"
                  className="form-checkbox mr-2"
                  onChange={handleChange}
                />
                <label htmlFor="female" className="mr-6">
                  Female
                </label>
                <input
                  type="radio"
                  id="other"
                  name="gender"
                  value="other"
                  className="form-checkbox mr-2"
                  onChange={handleChange}
                />
                <label htmlFor="other">Other</label>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600 focus:outline-none"
              >
                Register
              </button>
              <p className="font-bold">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-500 hover:text-blue-700 hover:underline"
                >
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
