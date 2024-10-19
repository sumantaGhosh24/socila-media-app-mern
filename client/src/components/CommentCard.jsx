import {Link} from "react-router-dom";
import moment from "moment";

const CommentCard = ({comment}) => {
  return (
    <div className="p-3 bg-gray-200 rounded-md my-2">
      <Link
        to={`/profile/${comment.user._id}`}
        className="flex items-center gap-2 mb-2"
      >
        <img
          src={comment.user.avatar}
          alt="avatar"
          className="h-8 w-8 rounded-full"
        />
        <h6 className="font-base font-bold capitalize">
          {comment.user.username}
        </h6>
      </Link>
      <p className="mb-2">{comment.content}</p>
      <p className="text-xs">{moment(comment.createdAt).fromNow()}</p>
    </div>
  );
};

export default CommentCard;
