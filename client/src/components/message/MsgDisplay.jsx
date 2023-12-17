import React from "react";
import {useSelector, useDispatch} from "react-redux";

import {imageShow, videoShow} from "../../utils/mediaShow";
import {Times, Avatar} from "../";

const MsgDisplay = ({user, msg, theme, data}) => {
  const dispatch = useDispatch();

  const handleDeleteMessages = () => {
    if (!data) return;

    // if (window.confirm("Do you want to delete?")) {
    //   dispatch(deleteMessages({msg, data, auth}));
    // }
  };

  return (
    <>
      <div>
        <Avatar src={user.avatar} size="small-avatar" />
        <span>{user.username}</span>
      </div>
      <div>
        {user._id === auth.user._id && (
          <i onClick={handleDeleteMessages}>trash</i>
        )}
        <div>
          {msg.text && <div>{msg.text}</div>}
          {msg.media.map((item, index) => (
            <div key={index}>
              {item.url.match(/video/i)
                ? videoShow(item.url, theme)
                : imageShow(item.url, theme)}
            </div>
          ))}
        </div>
        {msg.call && (
          <button>
            <span
              style={{
                fontSize: "2.5rem",
                color: msg.call.times === 0 ? "crimson" : "green",
                filter: theme ? "invert(1)" : "invert(0)",
              }}
            >
              {msg.call.times === 0
                ? msg.call.video
                  ? "videocam_off"
                  : "phone_disabled"
                : msg.call.video
                ? "video_camera_front"
                : "call"}
            </span>
            <div>
              <h6>{msg.call.video ? "Video Call" : "Audio Call"}</h6>
              <small>
                {msg.call.times > 0 ? (
                  <Times total={msg.call.times} />
                ) : (
                  new Date(msg.createdAt).toLocaleTimeString()
                )}
              </small>
            </div>
          </button>
        )}
      </div>
      <div>{new Date(msg.createdAt).toLocaleString()}</div>
    </>
  );
};

export default MsgDisplay;
