import {useEffect} from "react";
import {FaSearch, FaTimes} from "react-icons/fa";
import {useSelector, useDispatch} from "react-redux";
import {toast} from "react-toastify";

import {reset, searchUser} from "../features/user/userSlice";

const Search = ({search, setSearch}) => {
  const {searchUsers, isLoading, isSuccess, isError, message} = useSelector(
    (state) => state.user
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (isError) {
      toast.error(typeof message === "object" ? message.message : message, {
        toastId: "search-error",
      });
    }
    if (isSuccess) {
      toast.success(typeof message === "object" ? message.message : message, {
        toastId: "search-success",
      });
    }
    dispatch(reset());
  }, [searchUsers, isError, isSuccess, message, dispatch]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search) return;
    dispatch(searchUser(search));
  };

  const handleClose = () => {
    setSearch("");
    dispatch(reset());
  };

  return (
    <>
      <div>
        <form
          className="ml-4 flex items-center md:ml-6"
          onSubmit={handleSearch}
        >
          <div className="relative">
            <input
              type="text"
              className="bg-gray-700 text-white rounded-md pl-10 pr-4 py-2 focus:outline-none focus:bg-white focus:text-gray-900 placeholder-gray-400"
              placeholder="Search your query"
              name="search"
              value={search}
              id="search"
              onChange={(e) => setSearch(e.target.value.toLowerCase())}
            />
            <button
              className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              type="submit"
              disabled={isLoading}
            >
              <FaSearch color="gray" />
            </button>
            {search && (
              <button
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={handleClose}
              >
                <FaTimes color="gray" />
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default Search;
