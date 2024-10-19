import {useState, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";

import {LoadMoreBtn, PostThumb} from "./";
import {getUserPosts, reset} from "../features/post/postSlice";

const ProfilePosts = ({id}) => {
  const [posts, setPosts] = useState([]);
  const [result, setResult] = useState(true);
  const [page, setPage] = useState(1);

  const dispatch = useDispatch();

  const {userPosts, isLoading} = useSelector((state) => state.post);

  const handleLoadMore = () => {
    dispatch(getUserPosts({id, limit: page * 9}));
    dispatch(reset());
    setPage(page + 1);
  };

  useEffect(() => {
    setResult(page === 1 ? true : userPosts.next);
    setPosts(userPosts.posts);
  }, [page, userPosts]);

  if (isLoading) return null;

  return (
    <div className="my-3">
      <PostThumb posts={posts} />
      <LoadMoreBtn result={result} handleLoadMore={handleLoadMore} />
    </div>
  );
};

export default ProfilePosts;
