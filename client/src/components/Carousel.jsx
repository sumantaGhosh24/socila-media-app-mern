import {useState} from "react";

const Carousel = ({images}) => {
  const [currentImage, setCurrentImage] = useState(images[0]);

  return (
    <div>
      {currentImage && (
        <img
          src={currentImage}
          alt="current image"
          className="h-[300px] w-full rounded mb-4"
        />
      )}
      <div className="flex gap-3">
        {images.map((image, i) => (
          <img
            src={image}
            alt={`image-${i}`}
            key={i}
            className={`h-10 w-10 rounded cursor-pointer ${
              currentImage === image && "border-2 border-blue-500"
            }`}
            onClick={() => setCurrentImage(image)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
