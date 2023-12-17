import {useEffect} from "react";
import {useDispatch} from "react-redux";
import propTypes from "prop-types";

import {useAuth} from "../../../hooks";
import {getUser} from "../../../features/user/userSlice";
import {deleteComment} from "../../../features/comment/commentSlice";

const CommentMenu = ({post, comment, setOnEdit}) => {
  const {id} = useAuth();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser(id));
  }, [id, dispatch]);

  const handleRemove = () => {
    if (post.user._id === id || comment.user._id === id) {
      dispatch(deleteComment(post._id));
    }
  };

  const MenuItem = () => {
    return (
      <>
        <div onClick={() => setOnEdit(true)}>
          <span>create</span> Edit
        </div>
        <div onClick={handleRemove}>
          <span>delete_outline</span> Remove
        </div>
      </>
    );
  };

  return (
    <div>
      {(post.user._id === id || comment.user._id === id) && (
        <div>
          <span id="moreLink">more_vert</span>
          <div>
            {post.user._id === id ? (
              comment.user._id === id ? (
                MenuItem()
              ) : (
                <div onClick={handleRemove}>
                  <span>delete_outline</span> Remove
                </div>
              )
            ) : (
              comment.user._id === id && MenuItem()
            )}
          </div>
        </div>
      )}
    </div>
  );
};

CommentMenu.propTypes = {
  post: propTypes.any,
  comment: propTypes.any,
  setOnEdit: propTypes.any,
};

export default CommentMenu;
