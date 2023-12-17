import {Link, useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import moment from "moment";
import {toast} from "react-toastify";
import {MdOutlineCreate} from "react-icons/md";
import {BsFillTrashFill, BsFillClipboardHeartFill, BsEye} from "react-icons/bs";
import propTypes from "prop-types";

import {Avatar} from "../../";
import {deletePost} from "../../../features/post/postSlice";
import {useAuth} from "../../../hooks";
import {BASE_URL_FRONTEND} from "../../../utils/config";

const CardHeader = ({post, setEdit}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate()

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

  const handleEdit = () => {
    setEdit(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${BASE_URL_FRONTEND}/post/${post._id}`);
  };

  return (
    <div className="flex">
      <div>
        <Avatar
          image={post?.user?.avatar}
          alt={post?.user?.username}
          size="large"
        />
        <div>
          <h6>
            <Link to={`/profile/${post?.user?._id}`}>
              {post?.user?.username}
            </Link>
          </h6>
          <small>{moment(post?.createdAt).fromNow()}</small>
        </div>
      </div>
      <div>
        <div>
          {userId === post?.user?._id && (
            <>
              <div onClick={handleEdit}>
                <MdOutlineCreate />
              </div>
              <div onClick={handleDelete}>
                <BsFillTrashFill />
              </div>
            </>
          )}
          <div onClick={handleCopyLink}>
            <BsFillClipboardHeartFill />
          </div>
          <BsEye onClick={() => navigate(`/post/${post._id}`)} />
        </div>
      </div>
    </div>
  );
};

CardHeader.propTypes = {
  post: propTypes.any,
  setEdit: propTypes.any,
};

export default CardHeader;
