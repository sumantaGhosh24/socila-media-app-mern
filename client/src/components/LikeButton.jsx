import {BsHeart, BsHeartFill} from "react-icons/bs";
import propTypes from "prop-types";

const LikeButton = ({isLike, handleLike, handleUnLike}) => {
  return (
    <>
      {isLike ? (
        <i onClick={handleUnLike}>
          <BsHeartFill />
        </i>
      ) : (
        <i onClick={handleLike}>
          <BsHeart />
        </i>
      )}
    </>
  );
};

LikeButton.propTypes = {
  isLike: propTypes.any,
  handleLike: propTypes.any,
  handleUnLike: propTypes.any,
};

export default LikeButton;
