import {useEffect} from "react";
import {MdRedo} from "react-icons/md";
import {useSelector, useDispatch} from "react-redux";

import {UserCard, FollowBtn} from "./";
import {getUser, suggestionsUser} from "../features/user/userSlice";
import {useAuth} from "../hooks";

const RightSideBar = () => {
  const {id} = useAuth();

  const dispatch = useDispatch();

  const {suggestionUsers, isLoading} = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(suggestionsUser());
  }, [dispatch]);

  const {user: currentUser, isLoading: userLoading} = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    dispatch(getUser(id));
  }, [dispatch, id]);

  if (isLoading || userLoading) return null;

  return (
    <div className="p-3 bg-gray-200 rounded-md shadow-md">
      <UserCard user={currentUser} />
      <div className="flex items-center justify-between my-3">
        <h5 className="text-lg font-bold">Suggestions for you</h5>
        <i
          onClick={() => dispatch(suggestionsUser())}
          className="cursor-pointer"
        >
          <MdRedo />
        </i>
      </div>
      <div className="flex flex-col gap-2">
        {suggestionUsers?.users?.map((user) => (
          <UserCard key={user._id} user={user}>
            <FollowBtn user={user} currentUser={id} />
          </UserCard>
        ))}
      </div>
    </div>
  );
};

export default RightSideBar;
