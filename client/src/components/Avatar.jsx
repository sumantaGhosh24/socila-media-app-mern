import propTypes from "prop-types";

const Avatar = ({image, alt, size}) => {
  return (
    <img
      className={`rounded-full ${size === "large" && "h-16 w-16"} ${
        size === "small" && "h-8 w-8"
      }`}
      src={image}
      alt={alt}
    />
  );
};

Avatar.propTypes = {
  image: propTypes.string,
  alt: propTypes.string,
  size: propTypes.string,
};

export default Avatar;
