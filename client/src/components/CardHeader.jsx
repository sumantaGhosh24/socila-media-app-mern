import {Link, useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import moment from "moment";
import {BsFillTrashFill, BsFillClipboardHeartFill, BsEye} from "react-icons/bs";
import {toast} from "react-toastify";

import {Avatar} from "./";
import {deletePost} from "../features/post/postSlice";
import {useAuth} from "../hooks";
import {BASE_URL_FRONTEND} from "../utils/config";

const CardHeader = ({post}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {user: authUser, id: userId} = useAuth();

  const handleDelete = () => {
    if (!authUser || !authUser.accessToken) return;
    if (userId !== post.user._id) {
      toast.error("Invalid Authentication.");
    }
    if (window.confirm("Do you really want to delete this post?")) {
      dispatch(deletePost(post._id));
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${BASE_URL_FRONTEND}/post/${post._id}`);
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <Avatar
          image={post?.user?.avatar}
          alt={post?.user?.username}
          size="large"
        />
        <div>
          <h6>
            <Link
              to={`/profile/${post?.user?._id}`}
              className="font-bold capitalize"
            >
              {post?.user?.username}
            </Link>
          </h6>
          <small>{moment(post?.createdAt).fromNow()}</small>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {userId === post?.user?._id && (
          <>
            <div onClick={handleDelete} className="cursor-pointer">
              <BsFillTrashFill size={24} color="red" />
            </div>
          </>
        )}
        <div onClick={handleCopyLink} className="cursor-pointer">
          <BsFillClipboardHeartFill size={24} color="black" />
        </div>
        <BsEye
          size={24}
          color="blue"
          onClick={() => navigate(`/post/${post._id}`)}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
};

export default CardHeader;
