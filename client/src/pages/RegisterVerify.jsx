import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {useNavigate, useSearchParams} from "react-router-dom";
import {toast} from "react-toastify";

import {reset, registerVerify} from "../features/auth/authSlice";
import {useAuth, useTitle} from "../hooks";

const RegisterVerify = () => {
  useTitle("Register Verification");

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

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
      navigate("/");
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const handleVerify = (e) => {
    e.preventDefault();
    dispatch(registerVerify(token));
  };

  return (
    <>
      {token ? (
        <div className="flex h-screen items-center justify-center bg-gray-200">
          <div className="container mx-auto text-center rounded-lg bg-white p-8 shadow-lg">
            <h1 className="mb-6 text-4xl font-bold">
              Click the below link to activate you account
            </h1>
            <button
              className="mb-6 rounded-full bg-blue-500 px-8 py-4 font-bold text-white hover:bg-blue-700 disabled:bg-blue-200 text-xl"
              onClick={handleVerify}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Click Me"}
            </button>
            <div className="text-2xl">
              <p>
                A activate email link send to your email account, click the link
                to activate your account.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-screen items-center justify-center bg-gray-200">
          <div className="container mx-auto text-center rounded-lg bg-white p-8 shadow-lg">
            <h1 className="mb-6 text-4xl font-bold">
              Visit your email address
            </h1>
            <div className="text-2xl">
              <p>
                A activate email link send to your email account, click the link
                to activate your account.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RegisterVerify;
