import {useState, useEffect} from "react";
import propTypes from "prop-types";

import CommentCard from "./CommentCard";

const CommentDisplay = ({comment, post, replyCm}) => {
  const [showRep, setShowRep] = useState([]);
  const [next, setNext] = useState(1);

  useEffect(() => {
    setShowRep(replyCm.slice(replyCm.length - next));
  }, [replyCm, next]);

  return (
    <div>
      <CommentCard comment={comment} post={post} commentId={comment._id}>
        <div>
          {showRep.map(
            (item, index) =>
              item.reply && (
                <CommentCard
                  key={index}
                  comment={item}
                  post={post}
                  commentId={comment._id}
                />
              )
          )}
          {replyCm.length - next > 0 ? (
            <div onClick={() => setNext(next + 10)}>See more comments...</div>
          ) : (
            replyCm.length > 1 && (
              <div onClick={() => setNext(1)}>Hide comments...</div>
            )
          )}
        </div>
      </CommentCard>
    </div>
  );
};

CommentDisplay.propTypes = {
  comment: propTypes.any,
  post: propTypes.any,
  replyCm: propTypes.any,
};

export default CommentDisplay;
