import {useEffect} from "react";
import {useParams} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import {toast} from "react-toastify";

import {Loading, PostCard} from "../components";
import {useTitle} from "../hooks";
import {getPost, reset} from "../features/post/postSlice";

const Post = () => {
  useTitle("Post");

  const {id} = useParams();

  const dispatch = useDispatch();

  const {post, isLoading, isSuccess, isError, message} = useSelector(
    (state) => state.post
  );

  useEffect(() => {
    if (!id) return;
    dispatch(getPost(id));
  }, [dispatch, id]);

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

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto">
      {post ? <PostCard post={post} /> : <h2>No post found.</h2>}
    </div>
  );
};

export default Post;
