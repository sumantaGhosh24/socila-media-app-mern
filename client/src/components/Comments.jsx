import {useState, useEffect} from "react";

import {CommentCard} from "./";

const Comments = ({post}) => {
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState([]);
  const [next, setNext] = useState(2);

  useEffect(() => {
    const newCm = post.comments.filter((cm) => !cm.reply);
    setComments(newCm);
    setShowComments(newCm.slice(newCm.length - next));
  }, [post.comments, next]);

  return (
    <div className="mb-2">
      {showComments.map((comment, index) => (
        <CommentCard key={index} comment={comment} />
      ))}
      {comments.length - next > 0 ? (
        <div
          onClick={() => setNext(next + 10)}
          className="text-xs font-bold mt-3"
        >
          See more comments...
        </div>
      ) : (
        comments.length > 2 && (
          <div onClick={() => setNext(2)} className="text-xs font-bold mt-3">
            Hide comments...
          </div>
        )
      )}
    </div>
  );
};

export default Comments;
