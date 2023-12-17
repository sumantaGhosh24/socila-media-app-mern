import {Link} from "react-router-dom";
import propTypes from "prop-types";

import {Avatar} from "./";

const UserCard = ({children, user}) => {
  return (
    <Link to={`/profile/${user._id}`}>
      <div className="max-w-[400px] overflow-hidden bg-white border-b-2 border-gray-500 last:border-b-0">
        <div className="px-6 py-4">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <img
                className="w-full h-full"
                src={user.avatar}
                alt={user.username}
              />
              <Avatar src={user.avatar} size="large" />
            </div>
            <div className="ml-4">
              <p className="text-gray-500">@{user.username}</p>
              <p className="text-xl font-bold">{user.fullname}</p>
            </div>
          </div>
        </div>
        {children}
      </div>
    </Link>
  );
};

UserCard.propTypes = {
  children: propTypes.any,
  user: propTypes.any,
};

export default UserCard;
