import {useState} from "react";
import propTypes from "prop-types";

import {
  CardHeader,
  CardBody,
  CardFooter,
  Comments,
  InputComment,
  EditPost,
} from "./";

const PostCard = ({post}) => {
  const [edit, setEdit] = useState(false);

  return (
    <div className="test-1">
      <CardHeader post={post} setEdit={setEdit} />
      <CardBody post={post} />
      <CardFooter post={post} />
      <Comments post={post} />
      <InputComment post={post} />
      {edit && <EditPost setEdit={setEdit} post={post} />}
    </div>
  );
};

PostCard.propTypes = {
  post: propTypes.any,
};

export default PostCard;
