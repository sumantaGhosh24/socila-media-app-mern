import {useSelector} from "react-redux";
import propTypes from "prop-types";

import UserCard from "../UserCard";
import FollowBtn from "../FollowBtn";

const Followers = ({users, setShowFollowers, currentUser}) => {
  const {auth} = useSelector((state) => state);
  return (
    <div>
      <div>
        <h5>Followers</h5>
        <hr />
        <div>
          {users.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              setShowFollowers={setShowFollowers}
            >
              {auth.user._id !== user._id && (
                <FollowBtn user={user} currentUser={currentUser} />
              )}
            </UserCard>
          ))}
        </div>
        <div onClick={() => setShowFollowers(false)}>&times;</div>
      </div>
    </div>
  );
};

Followers.propTypes = {
  users: propTypes.any,
  setShowFollowers: propTypes.any,
  currentUser: propTypes.any,
};

export default Followers;
