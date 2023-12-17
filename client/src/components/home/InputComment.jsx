import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import propTypes from "prop-types";
import {toast} from "react-toastify";

import {createComment, reset} from "../../features/comment/commentSlice";
import {Icons, Loading} from "../";

const InputComment = ({children, post, onReply, setOnReply}) => {
  const [content, setContent] = useState("");

  const {isLoading, isSuccess, isError, message} = useSelector(
    (state) => state.comment
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (isError) {
      toast.error(typeof message === "object" ? message.message : message, {
        toastId: "profile-error",
      });
    }
    if (isSuccess) {
      toast.success(typeof message === "object" ? message.message : message, {
        toastId: "profile-success",
      });
    }
    dispatch(reset());
  }, [isError, isSuccess, message, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) {
      if (setOnReply) return setOnReply(false);
      return;
    }

    setContent("");

    const newComment = {
      postId: post._id,
      content,
      tag: onReply && onReply.user,
      reply: onReply && onReply.commentId,
      postUserId: post.user._id,
      likes: [],
      createdAt: new Date().toISOString(),
    };

    dispatch(createComment({newComment}));

    if (setOnReply) return setOnReply(false);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <form onSubmit={handleSubmit}>
      {children}
      <input
        type="text"
        placeholder="Add your comments..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <Icons setContent={setContent} content={content} />
      <button type="submit">Post</button>
    </form>
  );
};

InputComment.propTypes = {
  children: propTypes.any,
  post: propTypes.any,
  onReply: propTypes.any,
  setOnReply: propTypes.any,
};

export default InputComment;
