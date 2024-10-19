import {useState} from "react";

import {Carousel} from "./";

const CardBody = ({post}) => {
  const [readMore, setReadMore] = useState(false);

  return (
    <div>
      <div className="mb-4">
        <span className="text-lg mr-1.5">
          {post?.content?.length < 60
            ? post.content
            : readMore
            ? post.content + " "
            : post?.content?.slice(0, 60) + "..."}
        </span>
        {post?.content?.length > 60 && (
          <span
            onClick={() => setReadMore(!readMore)}
            className="text-xs font-bold cursor-pointer"
          >
            {readMore ? "Hide content" : "Read more"}
          </span>
        )}
      </div>
      {post?.images?.length > 0 && <Carousel images={post.images} />}
    </div>
  );
};

export default CardBody;
