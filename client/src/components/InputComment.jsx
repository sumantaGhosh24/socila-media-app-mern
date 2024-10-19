import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";

import {createComment, reset} from "../features/comment/commentSlice";

const InputComment = ({post}) => {
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
      return;
    }

    setContent("");

    const newComment = {
      postId: post._id,
      content,
      postUserId: post.user._id,
      createdAt: new Date().toISOString(),
    };

    dispatch(createComment({newComment}));
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-1.5">
      <input
        type="text"
        className="form-input w-full rounded px-1 py-2 border-4 border-solid border-blue-400 focus:outline-none focus:ring-4"
        placeholder="Add your comments..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        type="submit"
        disabled={isLoading}
        className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600 disabled:bg-blue-200 focus:outline-none"
      >
        Post
      </button>
    </form>
  );
};

export default InputComment;
