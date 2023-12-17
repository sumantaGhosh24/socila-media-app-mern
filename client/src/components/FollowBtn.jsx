import {useState, useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import propTypes from "prop-types";

import Loading from "./alert/Loading";
import {follow, reset, unfollow} from "../features/user/userSlice";

const FollowBtn = ({user, currentUser}) => {
  const [followed, setFollowed] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {isSuccess, isLoading, isError, message} = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    if (isError) {
      if (typeof message === "object") {
        toast.error(message.message, {toastId: "follow-error"});
      } else {
        toast.error(message, {toastId: "follow-error"});
      }
    }
    if (isSuccess) {
      if (typeof message === "object") {
        toast.success(message.message, {toastId: "follow-success"});
      } else {
        toast.success(message, {toastId: "follow-success"});
      }
      navigate("/");
    }
    dispatch(reset());
  }, [isError, isSuccess, dispatch, navigate, message]);

  useEffect(() => {
    if (user.following.find((item) => item._id === currentUser)) {
      setFollowed(true);
    }
    return () => setFollowed(false);
  }, [user.following, user._id, currentUser]);

  const handleFollow = async (e) => {
    e.preventDefault();

    setFollowed(true);
    dispatch(follow(user._id));
  };

  const handleUnFollow = async (e) => {
    e.preventDefault();

    setFollowed(false);
    dispatch(unfollow(user._id));
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      {followed ? (
        <button onClick={handleUnFollow}>UnFollow</button>
      ) : (
        <button onClick={handleFollow}>Follow</button>
      )}
    </>
  );
};

FollowBtn.propTypes = {
  user: propTypes.any,
  currentUser: propTypes.any,
};

export default FollowBtn;
