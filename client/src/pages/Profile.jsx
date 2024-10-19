import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import {toast} from "react-toastify";

import {Info, ProfilePosts, Saved, ResetPassword} from "../components";
import {getUser, reset} from "../features/user/userSlice";
import {reset as postReset} from "../features/post/postSlice";
import {useAuth} from "../hooks";

const Profile = () => {
  const {id} = useParams();
  const {id: userId} = useAuth();
  const [saveTab, setSaveTab] = useState(false);
  const [resetPassword, setResetPassword] = useState(false);
  const [postTab, setPostTab] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {user, isLoading, isSuccess, isError, message} = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    dispatch(getUser(id));
    dispatch(postReset());
  }, [id, isSuccess, isError, dispatch]);

  useEffect(() => {
    if (isError) {
      toast.error(typeof message === "object" ? message.message : message, {
        toastId: "profile-error",
      });
    }
    if (isSuccess) {
      toast.success(typeof message === "object" ? message.message : message, {
        toastId: "profile-success",
      });
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  if (isLoading) return null;

  return (
    <div className="container mx-auto space-y-5">
      <Info auth={userId} profile={user} />
      {userId === id && (
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setPostTab(true);
              setSaveTab(false);
              setResetPassword(false);
            }}
            className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600 focus:outline-none"
          >
            Posts
          </button>
          <button
            onClick={() => {
              setPostTab(false);
              setSaveTab(true);
              setResetPassword(false);
            }}
            className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600 focus:outline-none"
          >
            Saved
          </button>
          <button
            onClick={() => {
              setPostTab(false);
              setSaveTab(false);
              setResetPassword(true);
            }}
            className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600 focus:outline-none"
          >
            Reset Password
          </button>
        </div>
      )}
      {saveTab && <Saved />}
      {postTab && <ProfilePosts id={id} />}
      {resetPassword && <ResetPassword />}
    </div>
  );
};

export default Profile;
