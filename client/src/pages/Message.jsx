import {useState} from "react";

import {LeftSide, RightSide} from "../components";

const Message = () => {
  const [message, setMessage] = useState("");

  return (
    <div className="container mx-auto">
      <div>
        <LeftSide message={message} setMessage={setMessage} />
      </div>
      <div>
        <RightSide message={message} />
      </div>
    </div>
  );
};

export default Message;
