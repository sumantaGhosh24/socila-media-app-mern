import {useState, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import propTypes from "prop-types";

import {reset, updatePost} from "../features/post/postSlice";
import {convertToBase64} from "../lib";
import Loading from "./alert/Loading";

const EditPost = ({setEdit, post}) => {
  const [content, setContent] = useState(post.content);
  const [images, setImages] = useState(post.images);

  const dispatch = useDispatch();

  const {isLoading, isError, isSuccess, message} = useSelector(
    (state) => state.post
  );

  useEffect(() => {
    if (isError) {
      toast.error(typeof message === "object" ? message.message : message, {
        toastId: "update-post-error",
      });
    }
    if (isSuccess) {
      toast.success(typeof message === "object" ? message.message : message, {
        toastId: "update-post-success",
      });
      setEdit(false);
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
      setImages([...images, base64]);
    });
    setImages(list);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updatePost({id: post._id, content, images}));
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="w-full max-w-[80%] overflow-hidden rounded-md bg-white px-10 py-10 shadow-md sm:rounded-lg">
      <h2 className="mb-6 text-center text-3xl font-bold">Update Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <div className="flex">
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
                  className="h-16 w-16"
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
            className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600 focus:outline-none"
          >
            Update Post
          </button>
        </div>
      </form>
    </div>
  );
};

EditPost.propTypes = {
  setEdit: propTypes.any,
  post: propTypes.any,
};

export default EditPost;
