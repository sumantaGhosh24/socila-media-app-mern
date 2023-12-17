import {useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {toast} from "react-toastify";

import {Loading, PostCard, Pagination} from "../components/";
import {getPostsDiscover, reset} from "../features/post/postSlice";
import {useTitle} from "../hooks";

const Discover = () => {
  useTitle("Discover");

  const {discoverPosts, isLoading, isSuccess, isError, message} = useSelector(
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
    dispatch(getPostsDiscover({search}));
  }, [dispatch, search]);

  const handlePagination = (num) => {
    const search = `?page=${num}`;
    dispatch(getPostsDiscover({search}));
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto">
      {discoverPosts?.posts?.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
      {discoverPosts.total > 1 && (
        <Pagination total={discoverPosts.total} callback={handlePagination} />
      )}
    </div>
  );
};

export default Discover;
