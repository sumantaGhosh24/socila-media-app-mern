import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";

import {Avatar} from "../";
import {useAuth} from "../../hooks";
import {Loading} from "../";
import {getUser} from "../../features/user/userSlice";

const Status = () => {
  const {id} = useAuth();
  const dispatch = useDispatch();

  const {user, isLoading} = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getUser(id));
  }, [dispatch, id]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <Avatar image={user.avatar} alt={user.username} size="large" />
      <button>{user.username}, what are you thinking?</button>
    </div>
  );
};

export default Status;
