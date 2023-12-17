import {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import moment from "moment";
import {useDispatch} from "react-redux";
import propTypes from "prop-types";

import {Avatar, LikeButton, CommentMenu, InputComment} from "../../";
import {useAuth} from "../../../hooks";
import {
  likeComment,
  unLikeComment,
  updateComment,
} from "../../../features/comment/commentSlice";

const CommentCard = ({children, comment, post, commentId}) => {
  const {id} = useAuth();

  const dispatch = useDispatch();

  const [content, setContent] = useState("");
  const [readMore, setReadMore] = useState(false);
  const [onEdit, setOnEdit] = useState(false);
  const [isLike, setIsLike] = useState(false);
  const [onReply, setOnReply] = useState(false);

  useEffect(() => {
    setContent(comment.content);
    setIsLike(false);
    setOnReply(false);
    if (comment.likes.find((like) => like._id === id)) {
      setIsLike(true);
    }
  }, [comment, id]);

  const handleUpdate = () => {
    if (comment.content !== content) {
      dispatch(updateComment({id: comment._id, content}));
      setOnEdit(false);
    } else {
      setOnEdit(false);
    }
  };

  const handleLike = () => {
    dispatch(likeComment(comment._id));
  };

  const handleUnLike = () => {
    dispatch(unLikeComment(comment._id));
  };

  const handleReply = () => {
    if (onReply) return setOnReply(false);
    setOnReply({...comment, commentId});
  };

  const styleCard = {
    opacity: comment._id ? 1 : 0.5,
    pointerEvents: comment._id ? "inherit" : "none",
  };

  return (
    <div style={styleCard}>
      <Link to={`/profile/${comment.user._id}`}>
        <Avatar src={comment.user.avatar} size="small-avatar" />
        <h6>{comment.user.username}</h6>
      </Link>
      <div>
        <div>
          {onEdit ? (
            <textarea
              rows="5"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          ) : (
            <div>
              {comment.tag && comment.tag._id !== comment.user._id && (
                <Link to={`/profile/${comment.tag._id}`}>
                  @{comment.tag.username}
                </Link>
              )}
              <span>
                {content.length < 100
                  ? content
                  : readMore
                  ? content + " "
                  : content.slice(0, 100) + "...."}
              </span>
              {content.length > 100 && (
                <span onClick={() => setReadMore(!readMore)}>
                  {readMore ? "Hide content" : "Read more"}
                </span>
              )}
            </div>
          )}
          <div>
            <small>{moment(comment.createdAt).fromNow()}</small>
            <small>{comment.likes.length} likes</small>
            {onEdit ? (
              <>
                <small onClick={handleUpdate}>update</small>
                <small onClick={() => setOnEdit(false)}>cancel</small>
              </>
            ) : (
              <small onClick={handleReply}>
                {onReply ? "cancel" : "reply"}
              </small>
            )}
          </div>
        </div>
        <div>
          <CommentMenu post={post} comment={comment} setOnEdit={setOnEdit} />
          <LikeButton
            isLike={isLike}
            handleLike={handleLike}
            handleUnLike={handleUnLike}
          />
        </div>
      </div>
      {onReply && (
        <InputComment post={post} onReply={onReply} setOnReply={setOnReply}>
          <Link to={`/profile/${onReply.user._id}`}>
            @{onReply.user.username}:
          </Link>
        </InputComment>
      )}
      {children}
    </div>
  );
};

CommentCard.propTypes = {
  children: propTypes.any,
  comment: propTypes.any,
  post: propTypes.any,
  commentId: propTypes.any,
};

export default CommentCard;
