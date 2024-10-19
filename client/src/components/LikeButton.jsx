import {BsHeart, BsHeartFill} from "react-icons/bs";

const LikeButton = ({isLike, handleLike, handleUnLike}) => {
  return (
    <>
      {isLike ? (
        <i onClick={handleUnLike}>
          <BsHeartFill size={24} color="red" className="cursor-pointer" />
        </i>
      ) : (
        <i onClick={handleLike}>
          <BsHeart size={24} className="cursor-pointer" />
        </i>
      )}
    </>
  );
};

export default LikeButton;
