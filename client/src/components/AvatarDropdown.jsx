import {useState, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import propTypes from "prop-types";

import {getUser, reset} from "../features/user/userSlice";
import {Loading} from "./";

const AvatarDropdown = ({id}) => {
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {user, isLoading, isSuccess, isError, message} = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    dispatch(getUser(id));
  }, [id, isSuccess, isError]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess) {
      toast.success(message);
    }
    dispatch(reset());
  }, [isError, isSuccess, message, dispatch]);

  const handleToggleAvatar = () => {
    setIsAvatarOpen(!isAvatarOpen);
  };

  const handleLogout = (e) => {
    e.preventDefault();

    if (!user) return;
    navigate("/logout");
  };

  const handleProfile = () => {
    navigate(`/profile/${id}`);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="relative">
      <button
        onClick={handleToggleAvatar}
        className="flex items-center focus:outline-none"
      >
        <img
          className="w-8 h-8 rounded-full"
          src={user.avatar}
          alt={user.username}
        />
      </button>
      {isAvatarOpen && (
        <div className="absolute right-0 mt-2 py-2 bg-white shadow-lg rounded-md">
          <button className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left capitalize border-b-2 border-gray-500">
            {user.username}
          </button>
          <button
            onClick={handleProfile}
            className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
          >
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

AvatarDropdown.propTypes = {
  id: propTypes.string,
};

export default AvatarDropdown;
