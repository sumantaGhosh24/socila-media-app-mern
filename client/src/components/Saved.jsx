import {useState, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";

import {PostThumb, LoadMoreBtn} from "./";
import {getSavePosts, reset} from "../features/post/postSlice";

const Saved = () => {
  const [posts, setPosts] = useState([]);
  const [result, setResult] = useState(true);
  const [page, setPage] = useState(1);

  const dispatch = useDispatch();

  const {savePosts, isLoading} = useSelector((state) => state.post);

  const handleLoadMore = async () => {
    dispatch(getSavePosts({page, limit: page * 9}));
    dispatch(reset());
    setPage(page + 1);
  };

  useEffect(() => {
    setResult(page === 1 ? true : savePosts.next);
    setPosts(savePosts.posts);
  }, [page, savePosts]);

  if (isLoading) return null;

  return (
    <div className="my-3">
      <PostThumb posts={posts} />
      <LoadMoreBtn result={result} handleLoadMore={handleLoadMore} />
    </div>
  );
};

export default Saved;
