import {useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {toast} from "react-toastify";

import {Pagination, PostCard} from "./";
import {getPosts, reset} from "../features/post/postSlice";

const Posts = () => {
  const {posts, isLoading, isSuccess, isError, message} = useSelector(
    (state) => state.post
  );

  const dispatch = useDispatch();

  const search = window.location.search;

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

  useEffect(() => {
    dispatch(getPosts({search}));
  }, [dispatch, search]);

  const handlePagination = (num) => {
    const search = `?page=${num}`;
    dispatch(getPosts({search}));
  };

  if (isLoading) return null;

  return (
    <div>
      {posts?.posts?.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
      {posts.total > 1 && (
        <Pagination total={posts.total} callback={handlePagination} />
      )}
    </div>
  );
};

export default Posts;
