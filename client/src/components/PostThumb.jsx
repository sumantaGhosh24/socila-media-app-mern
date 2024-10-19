import {Link} from "react-router-dom";

const PostThumb = ({posts}) => {
  return (
    <div>
      {posts?.map((post) => (
        <Link key={post._id} to={`/post/${post._id}`}>
          <div className="bg-gray-200 rounded-md p-3 mb-4 flex items-start gap-5">
            <img
              src={post.images[0]}
              alt={post.images[0]}
              className="max-h-[200px] max-w-[300px] rounded"
            />
            <div>
              <p className="text-xl font-bold capitalize">{post.content}</p>
              <div className="flex items-center gap-4">
                <i>Like: {post?.likes?.length}</i>
                <i>Comment: {post?.comments?.length}</i>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default PostThumb;
