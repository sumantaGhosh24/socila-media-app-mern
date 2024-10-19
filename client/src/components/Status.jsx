import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";

import {Avatar} from "./";
import {useAuth} from "../hooks";
import {getUser} from "../features/user/userSlice";

const Status = ({setShow}) => {
  const {id} = useAuth();
  const dispatch = useDispatch();

  const {user, isLoading} = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getUser(id));
  }, [dispatch, id]);

  return (
    <div className="bg-gray-200 p-3 rounded-md shadow-md flex items-center gap-3">
      <Avatar image={user.avatar} alt={user.username} size="large" />
      <button
        className="font-bold text-xl capitalize disabled:cursor-not-allowed"
        onClick={() => setShow((prev) => !prev)}
        disabled={isLoading}
      >
        {user.username}, what are you thinking?
      </button>
    </div>
  );
};

export default Status;
