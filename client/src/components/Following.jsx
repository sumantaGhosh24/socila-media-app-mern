import {useSelector} from "react-redux";

import {UserCard, FollowBtn} from "./";

const Following = ({users, setShowFollowing, currentUser}) => {
  const {auth} = useSelector((state) => state);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h5>Following</h5>
        <div
          onClick={() => setShowFollowing(false)}
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
            setShowFollowing={setShowFollowing}
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

export default Following;
