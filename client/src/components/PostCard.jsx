import {CardHeader, CardBody, CardFooter, Comments, InputComment} from "./";

const PostCard = ({post}) => {
  return (
    <div className="my-3 shadow-md rounded-md p-3">
      <CardHeader post={post} />
      <hr className="my-3" />
      <CardBody post={post} />
      <hr className="my-3" />
      <CardFooter post={post} />
      <hr className="my-3" />
      <Comments post={post} />
      <InputComment post={post} />
    </div>
  );
};

export default PostCard;
