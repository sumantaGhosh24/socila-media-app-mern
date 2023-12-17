import {Link} from "react-router-dom";
import propTypes from "prop-types";

const PostThumb = ({posts}) => {
  return (
    <div>
      {posts?.map((post) => (
        <Link key={post._id} to={`/post/${post._id}`}>
          <div className="test-1">
            {/* <img src={post.images[0]} alt={post.images[0]} /> */}
            <p>{post.content}</p>
            <p>{post._id}</p>
            <div>
              <i>heart {post?.likes?.length}</i>
              <i>comment {post?.comments?.length}</i>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

PostThumb.propTypes = {
  posts: propTypes.any,
};

export default PostThumb;
