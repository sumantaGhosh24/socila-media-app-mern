import {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {MdBookmarkBorder} from "react-icons/md";
import {FaComment} from "react-icons/fa";
import {BsBookmarkFill, BsHeart, BsHeartFill, BsSend} from "react-icons/bs";

import {ShareModal} from "./";
import {BASE_URL_FRONTEND} from "../utils/config";
import {
  likePost,
  savePost,
  unLikePost,
  unSavePost,
} from "../features/post/postSlice";
import {getUser} from "../features/user/userSlice";
import {useAuth} from "../hooks";

const CardFooter = ({post}) => {
  const [isLike, setIsLike] = useState(false);
  const [isShare, setIsShare] = useState(false);
  const [saved, setSaved] = useState(false);

  const {id: authId} = useAuth();
  const dispatch = useDispatch();

  const {isLoading} = useSelector((state) => state.post);

  const {user} = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getUser(authId));
  }, [dispatch, authId]);

  useEffect(() => {
    if (post.likes.find((like) => like === authId)) {
      setIsLike(true);
    } else {
      setIsLike(false);
    }
  }, [post.likes, authId]);

  const handleLike = () => {
    dispatch(likePost({id: post._id}));
  };

  const handleUnLike = () => {
    dispatch(unLikePost({id: post._id}));
  };

  useEffect(() => {
    if (user.saved.find((id) => id === post._id)) {
      setSaved(true);
    } else {
      setSaved(false);
    }
  }, [user.saved, post._id]);

  const handleSavePost = () => {
    dispatch(savePost({id: post._id}));
  };

  const handleUnSavePost = () => {
    dispatch(unSavePost({id: post._id}));
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        {isLike ? (
          <button
            onClick={handleUnLike}
            className="cursor-pointer disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            <BsHeartFill size={24} color="red" />
          </button>
        ) : (
          <button
            onClick={handleLike}
            className="cursor-pointer disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            <BsHeart size={24} />
          </button>
        )}
        <Link to={`/post/${post._id}`}>
          <FaComment size={24} className="cursor-pointer" />
        </Link>
        <BsSend
          size={24}
          className="cursor-pointer"
          onClick={() => setIsShare(!isShare)}
        />
        {saved ? (
          <button
            onClick={handleUnSavePost}
            className="cursor-pointer disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            <BsBookmarkFill size={24} />
          </button>
        ) : (
          <button
            onClick={handleSavePost}
            className="cursor-pointer disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            <MdBookmarkBorder size={24} />
          </button>
        )}
        <h6>{post?.likes?.length} likes</h6>
        <h6>{post?.comments?.length} comments</h6>
      </div>
      {isShare && <ShareModal url={`${BASE_URL_FRONTEND}/post/${post._id}`} />}
    </div>
  );
};

export default CardFooter;
