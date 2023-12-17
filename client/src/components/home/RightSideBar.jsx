import {useEffect} from "react";
import {MdRedo} from "react-icons/md";
import {useSelector, useDispatch} from "react-redux";

import {UserCard, FollowBtn, Loading} from "../";
import {getUser, suggestionsUser} from "../../features/user/userSlice";
import {useAuth} from "../../hooks";

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

  if (isLoading || userLoading) {
    return <Loading />;
  }

  return (
    <div>
      <UserCard user={currentUser} />
      <div>
        <h5>Suggestions for you</h5>
        <i
          onClick={() => dispatch(suggestionsUser())}
          className="cursor-pointer"
        >
          <MdRedo />
        </i>
      </div>
      <div>
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
