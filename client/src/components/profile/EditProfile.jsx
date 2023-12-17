import {useState} from "react";
import {useDispatch} from "react-redux";
import propTypes from "prop-types";

import {updateUser} from "../../features/user/userSlice";
import {convertToBase64} from "../../lib";

const EditProfile = ({setOnEdit, user}) => {
  const [userData, setUserData] = useState({
    fullname: user.fullname || "",
    mobile: user.mobile || "",
    address: user.address || "",
    website: user.website || "",
    story: user.story || "",
    gender: user.gender || "",
    avatar: user.avatar || "https://placehold.co/600x400/000000/FFFFFF.png",
  });
  const {fullname, mobile, address, website, story, gender, avatar} = userData;

  const dispatch = useDispatch();

  const changeAvatar = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    setUserData({...userData, avatar: base64});
  };

  const handleInput = (e) => {
    const {name, value} = e.target;
    setUserData({...userData, [name]: value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUser({...userData, avatar}));
  };

  return (
    <>
      <div className="flex items-center justify-center bg-gray-100 h-[100vh]">
        <div className="mx-auto my-10 w-full max-w-[80%] overflow-hidden rounded-md bg-white px-10 py-10 shadow-md sm:rounded-lg">
          <h2 className="mb-6 text-center text-3xl font-bold">
            Update Profile
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <img
                src={
                  typeof avatar === "string"
                    ? avatar
                    : URL.createObjectURL(avatar)
                }
                alt="avatar"
              />
              <span>
                <i>📷</i> <p>Change</p>
                <input
                  type="file"
                  name="file"
                  id="file_up"
                  accept="image/*"
                  onChange={changeAvatar}
                />
              </span>
            </div>
            <div className="mb-4">
              <label
                htmlFor="fullname"
                className="mb-2 block font-bold text-gray-700"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                value={fullname}
                onChange={handleInput}
                className="form-input w-full rounded px-1 py-2 border-4 border-solid border-blue-400 focus:outline-none focus:ring-4"
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="mobile"
                className="mb-2 block font-bold text-gray-700"
              >
                Mobile
              </label>
              <input
                type="text"
                name="mobile"
                value={mobile}
                onChange={handleInput}
                className="form-input w-full rounded px-1 py-2 border-4 border-solid border-blue-400 focus:outline-none focus:ring-4"
                placeholder="Enter your mobile number"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="address"
                className="mb-2 block font-bold text-gray-700"
              >
                Address
              </label>
              <input
                type="text"
                name="address"
                value={address}
                onChange={handleInput}
                className="form-input w-full rounded px-1 py-2 border-4 border-solid border-blue-400 focus:outline-none focus:ring-4"
                placeholder="Enter your address"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="website"
                className="mb-2 block font-bold text-gray-700"
              >
                Website
              </label>
              <input
                type="text"
                name="website"
                value={website}
                onChange={handleInput}
                className="form-input w-full rounded px-1 py-2 border-4 border-solid border-blue-400 focus:outline-none focus:ring-4"
                placeholder="Enter your website url"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="story"
                className="mb-2 block font-bold text-gray-700"
              >
                Story
              </label>
              <textarea
                name="story"
                value={story}
                cols="30"
                rows="4"
                onChange={handleInput}
                className="form-input w-full rounded px-1 py-2 border-4 border-solid border-blue-400 focus:outline-none focus:ring-4"
                placeholder="Enter your story"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="gender"
                className="mb-2 block font-bold text-gray-700"
              >
                Gender
              </label>
              <select
                name="gender"
                id="gender"
                value={gender}
                onChange={handleInput}
                className="form-input w-full rounded px-1 py-2 border-4 border-solid border-blue-400 focus:outline-none focus:ring-4"
                required
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="flex">
              <button
                onClick={() => setOnEdit(false)}
                className="focus:shadow-outline rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600 focus:outline-none"
              >
                Close
              </button>
              <button
                type="submit"
                className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600 focus:outline-none"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

EditProfile.propTypes = {
  setOnEdit: propTypes.any,
  user: propTypes.object,
};

export default EditProfile;
