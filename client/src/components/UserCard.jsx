import {Link} from "react-router-dom";

const UserCard = ({children, user}) => {
  return (
    <Link to={`/profile/${user._id}`}>
      <div className="overflow-hidden bg-white border-b-2 border-gray-500 last:border-b-0 flex justify-between p-1.5 rounded">
        <div className="flex items-center">
          <img
            className="w-12 h-12 rounded-full"
            src={user.avatar}
            alt={user.username}
          />
          <div className="ml-4">
            <p className="text-gray-500 text-xs">@{user.username}</p>
            <p className="text-xs font-bold">{user.fullname}</p>
          </div>
        </div>
        {children}
      </div>
    </Link>
  );
};

export default UserCard;
