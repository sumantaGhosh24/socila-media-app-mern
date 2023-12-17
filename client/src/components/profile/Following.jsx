import {useSelector} from "react-redux";
import propTypes from "prop-types";

import UserCard from "../UserCard";
import FollowBtn from "../FollowBtn";

const Following = ({users, setShowFollowing, currentUser}) => {
  const {auth} = useSelector((state) => state);
  return (
    <div>
      <div>
        <h5>Following</h5>
        <hr />
        <div>
          {users.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              setShowFollowing={setShowFollowing}
            >
              {auth.user._id !== user._id && (
                <FollowBtn user={user} currentUser={currentUser} />
              )}
            </UserCard>
          ))}
        </div>
        <div onClick={() => setShowFollowing(false)}>&times;</div>
      </div>
    </div>
  );
};

Following.propTypes = {
  users: propTypes.any,
  setShowFollowing: propTypes.any,
  currentUser: propTypes.any,
};

export default Following;
