import {useState, useEffect, useRef} from "react";
import {useSelector, useDispatch} from "react-redux";
import propTypes from "prop-types";

import {UserCard, Loading} from "../";
import {searchUser} from "../../features/user/userSlice";

const LeftSide = ({message, setMessage}) => {
  const [search, setSearch] = useState("");

  const {searchUsers, isLoading} = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const pageEnd = useRef();
  const [page, setPage] = useState(0);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search) return;
    dispatch(searchUser(search));
  };

  const handleAddUser = (user) => {
    setSearch("");
    setMessage(user._id);
  };

  const isActive = (user) => {
    if (message === user._id) return "active";
    return "";
  };

  // useEffect(() => {
  //   dispatch(getConversations());
  // }, [dispatch]);

  useEffect(() => {
    // const observer = new IntersectionObserver(
    //   (entries) => {
    //     if (entries[0].isIntersecting) {
    //       setPage((p) => p + 1);
    //     }
    //   },
    //   {
    //     threshold: 0.1,
    //   }
    // );
    // observer.observe(pageEnd.current);
  }, [setPage]);

  // useEffect(() => {
  // if (message.resultUsers >= (page - 1) * 9 && page > 1) {
  //   dispatch(getConversations({auth, page}));
  // }
  // }, [dispatch]);

  // useEffect(() => {
  // if (message.firstLoad) {
  //   dispatch({type: MESS_TYPES.CHECK_ONLINE_OFFLINE, payload: online});
  // }
  // }, [online, message.firstLoad, dispatch]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={search}
          placeholder="Enter to Search..."
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" style={{display: "none"}}>
          Search
        </button>
      </form>
      <div>
        {searchUsers.length !== 0 ? (
          <>
            {searchUsers.map((user) => (
              <div
                key={user._id}
                className={`${isActive(user)}`}
                onClick={() => handleAddUser(user)}
              >
                <UserCard user={user} />
              </div>
            ))}
          </>
        ) : (
          <>
            {message.users.map((user) => (
              <div
                key={user._id}
                className={`${isActive(user)}`}
                onClick={() => handleAddUser(user)}
              >
                {/* <UserCard user={user} msg={true}>
                  {user.online ? (
                    <i>circle</i>
                  ) : (
                    auth.user.following.find(
                      (item) => item._id === user._id
                    ) && <i>circle</i>
                  )}
                </UserCard> */}
              </div>
            ))}
          </>
        )}
        <button ref={pageEnd}>Load More</button>
      </div>
    </>
  );
};

LeftSide.propTypes = {
  message: propTypes.any,
  setMessage: propTypes.any,
};

export default LeftSide;
