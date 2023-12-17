import {useState} from "react";
import propTypes from "prop-types";

import Carousel from "../../Carousel";

const CardBody = ({post}) => {
  const [readMore, setReadMore] = useState(false);

  return (
    <div>
      <div>
        <span>
          {post?.content?.length < 60
            ? post.content
            : readMore
            ? post.content + " "
            : post?.content?.slice(0, 60) + "..."}
        </span>
        {post?.content?.length > 60 && (
          <span onClick={() => setReadMore(!readMore)}>
            {readMore ? "Hide content" : "Read more"}
          </span>
        )}
      </div>
      {post?.images?.length > 0 && <Carousel images={post.images} />}
    </div>
  );
};

CardBody.propTypes = {
  post: propTypes.any,
};

export default CardBody;
