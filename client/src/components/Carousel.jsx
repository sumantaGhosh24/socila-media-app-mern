import {useState} from "react";
import propTypes from "prop-types";

const Carousel = ({images}) => {
  const [currentImage, setCurrentImage] = useState(null);

  return (
    <div>
      {currentImage && (
        <img src={currentImage} alt="current image" className="h-24 w-24" />
      )}
      <div className="flex">
        {images.map((image, i) => (
          <img
            src={image}
            alt={`image-${i}`}
            key={i}
            className={`h-10 w-10 ${
              currentImage === image && "border-2 border-blue-500"
            }`}
            onClick={() => setCurrentImage(image)}
          />
        ))}
      </div>
    </div>
  );
};

Carousel.propTypes = {
  images: propTypes.array,
};

export default Carousel;
