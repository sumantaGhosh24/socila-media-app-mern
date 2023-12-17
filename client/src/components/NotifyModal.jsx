import {useState, useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import moment from "moment";
import {Link} from "react-router-dom";
import {FaBell, FaCircle} from "react-icons/fa";
import {toast} from "react-toastify";

import {Avatar, Loading} from "./";
import {getWordStr} from "../lib";
import {
  deleteAllNotifies,
  getNotifies,
  isReadNotify,
  reset,
} from "../features/notify/notifySlice";

const NotifyModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const {notify, isLoading, isError, isSuccess, message} = useSelector(
    (state) => state.notify
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (isError) {
      toast.error(typeof message === "object" ? message.message : message, {
        toastId: "notify-error",
      });
    }
    if (isSuccess) {
      toast.success(typeof message === "object" ? message.message : message, {
        toastId: "notify-success",
      });
      dispatch(getNotifies());
    }
    dispatch(reset());
  }, [isError, isSuccess, message, dispatch]);

  const handleDropdownToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleIsRead = (msg) => {
    dispatch(isReadNotify(msg));
  };

  const handleDeleteAll = (e) => {
    e.preventDefault();
    dispatch(deleteAllNotifies());
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="relative px-3">
        <button
          onClick={handleDropdownToggle}
          className="flex items-center focus:outline-none"
        >
          <FaBell size={28} color="white" className="md:ml-3" />
        </button>
        {isOpen && (
          <div className="absolute right-0 mt-2 py-2 bg-white shadow-lg rounded-md w-[450px]">
            {notify.map((notification) => (
              <Link
                to={`${notification.url}`}
                key={notification._id}
                onClick={() => handleIsRead(notification._id)}
                className="flex items-center flex-col px-4 py-2 text-gray-800 rounded bg-gray-200 w-full text-left"
              >
                <div className="flex justify-around items-center">
                  {notification.image && (
                    <img
                      className="w-10 h-10 rounded-full mr-2"
                      src={notification.image}
                      alt="Notification Image"
                    />
                  )}
                  <div className="ml-3">
                    <h3 className="font-semibold mb-3">{notification.text}</h3>
                    <p className="text-sm text-gray-500">
                      {getWordStr(notification.content, 10)}
                    </p>
                  </div>
                </div>
                <div className="flex mt-3 items-center w-full">
                  <Avatar
                    image={notification?.user?.avatar}
                    alt={notification?.user?.username}
                    size="small"
                  />
                  <h3 className="text-sm text-gray-500 font-bold ml-3">
                    @{notification?.user?.username}
                  </h3>
                </div>
                <div className="flex mt-3 justify-around items-center w-full">
                  {moment(notification.createdAt).fromNow()}
                  {!notification.isRead && <FaCircle />}
                </div>
              </Link>
            ))}
            {notify.length === 0 ? (
              <h2 className="ml-5 font-bold">
                You don&apos;t have any notifications!
              </h2>
            ) : (
              <div
                onClick={handleDeleteAll}
                className="focus:shadow-outline rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600 focus:outline-none max-w-fit mt-3 ml-3 cursor-pointer"
              >
                Delete All
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default NotifyModal;
