import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import {toast} from "react-toastify";

import {Info, Loading, ProfilePosts, Saved, ResetPassword} from "../components";
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

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto">
      <Info auth={userId} profile={user} />
      {userId === id && (
        <div>
          <button
            className={saveTab ? "" : "active"}
            onClick={() => {
              setPostTab(true);
              setSaveTab(false);
              setResetPassword(false);
            }}
          >
            Posts
          </button>
          <button
            className={saveTab ? "active" : ""}
            onClick={() => {
              setPostTab(false);
              setSaveTab(true);
              setResetPassword(false);
            }}
          >
            Saved
          </button>
          <button
            className={saveTab ? "active" : ""}
            onClick={() => {
              setPostTab(false);
              setSaveTab(false);
              setResetPassword(true);
            }}
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
