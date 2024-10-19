import {useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import {toast} from "react-toastify";

import {PostCard} from "../components";
import {useTitle} from "../hooks";
import {getPost, reset} from "../features/post/postSlice";

const Post = () => {
  useTitle("Post");

  const {id} = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {post, isLoading, isSuccess, isError, message} = useSelector(
    (state) => state.post
  );

  useEffect(() => {
    if (!id) return;
    dispatch(getPost(id));
  }, [dispatch, id, navigate]);

  useEffect(() => {
    if (isError) {
      if (typeof message === "object") {
        toast.error(message.message);
      } else {
        toast.error(message);
      }
    }
    if (isSuccess) {
      if (typeof message === "object") {
        toast.success(message.message);
      } else {
        toast.success(message);
      }
    }
    dispatch(reset());
  }, [isError, isSuccess, message, dispatch]);

  if (isLoading) return null;

  if (!post) return null;

  return (
    <div className="container mx-auto">
      {post ? <PostCard post={post} /> : <h2>No post found.</h2>}
    </div>
  );
};

export default Post;
