import {useSelector} from "react-redux";

import {UserCard, FollowBtn} from "./";

const Followers = ({users, setShowFollowers, currentUser}) => {
  const {auth} = useSelector((state) => state);
  return (
    <div>
      <div className="flex items-center justify-between">
        <h5>Followers</h5>
        <div
          onClick={() => setShowFollowers(false)}
          className="text-2xl font-bold text-red-600 cursor-pointer"
        >
          &times;
        </div>
      </div>
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
    </div>
  );
};

export default Followers;
