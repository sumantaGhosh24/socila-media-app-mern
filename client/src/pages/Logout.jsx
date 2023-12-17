import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";

import {useTitle} from "../hooks";
import {logout} from "../features/auth/authSlice";

const Logout = () => {
  useTitle("Logout User");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();

    dispatch(logout());
    navigate("/login");
  };

  return (
    <>
      <div className="flex items-center justify-center bg-gray-100 h-[100vh]">
        <div className="mx-auto my-10 w-full max-w-[80%] overflow-hidden rounded-md bg-white px-10 py-10 shadow-md sm:rounded-lg">
          <h2 className="mb-6 text-center text-3xl font-bold">
            Do you really want to logout!
          </h2>
          <button
            type="submit"
            className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600 focus:outline-none mx-auto block"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Logout;
