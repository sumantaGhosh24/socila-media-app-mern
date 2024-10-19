import {useState, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";

import {createPost, reset} from "../features/post/postSlice";
import {convertToBase64} from "../lib";

const AddPost = () => {
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);

  const dispatch = useDispatch();

  const {isLoading, isError, isSuccess, message} = useSelector(
    (state) => state.post
  );

  useEffect(() => {
    if (isError) {
      toast.error(typeof message === "object" ? message.message : message, {
        toastId: "create-post-error",
      });
    }
    if (isSuccess) {
      toast.success(typeof message === "object" ? message.message : message, {
        toastId: "create-post-success",
      });
      setContent("");
      setImages([]);
    }
    dispatch(reset());
  }, [dispatch, isError, isSuccess, message]);

  const handleInput = (e) => {
    setContent(e.target.value);
  };

  const handleImage = (e) => {
    const files = e.target.files;
    let list = [];
    Array.from(files).map(async (file) => {
      let base64 = await convertToBase64(file);
      setImages((prev) => [...prev, base64]);
    });
    setImages(list);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createPost({content, images}));
  };

  return (
    <div className="w-full overflow-hidden rounded-md px-10 py-10 shadow-md">
      <h2 className="mb-6 text-center text-3xl font-bold">Create Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-4">
            {images.length > 0 &&
              images.map((image, i) => (
                <img
                  src={
                    typeof image === "string"
                      ? image
                      : URL.createObjectURL(image)
                  }
                  alt="post image"
                  key={`post-${i}`}
                  className="h-24 w-24 rounded"
                />
              ))}
          </div>
          <input
            type="file"
            name="file"
            id="file_up"
            accept="image/*"
            onChange={handleImage}
            multiple
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="content"
            className="mb-2 block font-bold text-gray-700"
          >
            Content
          </label>
          <textarea
            name="content"
            value={content}
            cols="30"
            rows="4"
            onChange={handleInput}
            className="w-full rounded px-1 py-2 border-4 border-solid border-blue-400 focus:outline-none focus:ring-4"
            placeholder="Enter your content"
            required
          />
        </div>
        <div>
          <button
            type="submit"
            className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600 focus:outline-none disabled:bg-blue-200"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPost;
