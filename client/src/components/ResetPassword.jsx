import {useState} from "react";
import {useDispatch} from "react-redux";

import {resetPassword} from "../features/auth/authSlice";

const ResetPassword = () => {
  const [previousPassword, setPreviousPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [cf_newPassword, setCf_newPassword] = useState("");

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(resetPassword({previousPassword, newPassword, cf_newPassword}));
  };

  return (
    <div className="mx-auto my-10 w-full max-w-[80%] overflow-hidden rounded-md bg-white px-10 py-10 shadow-md sm:rounded-lg">
      <h2 className="mb-6 text-center text-3xl font-bold">Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="previousPassword"
            className="mb-2 block font-bold text-gray-700"
          >
            Previous Password
          </label>
          <input
            type="password"
            name="previousPassword"
            value={previousPassword}
            onChange={(e) => setPreviousPassword(e.target.value)}
            className="form-input w-full rounded px-1 py-2 border-4 border-solid border-blue-400 focus:outline-none focus:ring-4"
            placeholder="Enter your previous password"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="newPassword"
            className="mb-2 block font-bold text-gray-700"
          >
            New Password
          </label>
          <input
            type="password"
            name="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="form-input w-full rounded px-1 py-2 border-4 border-solid border-blue-400 focus:outline-none focus:ring-4"
            placeholder="Enter your new password"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="cf_newPassword"
            className="mb-2 block font-bold text-gray-700"
          >
            Confirm New Password
          </label>
          <input
            type="password"
            name="cf_newPassword"
            value={cf_newPassword}
            onChange={(e) => setCf_newPassword(e.target.value)}
            className="form-input w-full rounded px-1 py-2 border-4 border-solid border-blue-400 focus:outline-none focus:ring-4"
            placeholder="Enter your confirm new password"
            required
          />
        </div>
        <div>
          <button
            type="submit"
            className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600 focus:outline-none"
          >
            Reset Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
