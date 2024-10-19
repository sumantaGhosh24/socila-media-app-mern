import {useEffect, useState} from "react";

import {Status, Posts, RightSideBar, AddPost} from "../components";
import {useTitle} from "../hooks";

let scroll = 0;

const Home = () => {
  useTitle("Home");

  const [show, setShow] = useState(false);

  window.addEventListener("scroll", () => {
    if (window.location.pathname === "/") {
      scroll = window.pageYOffset;
      return scroll;
    }
  });

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({top: scroll, behavior: "smooth"});
    }, 100);
  }, []);

  return (
    <div className="container mx-auto flex items-start justify-between gap-3 flex-col md:flex-row p-3">
      <div className="flex flex-col gap-3 w-full md:w-3/4">
        <Status setShow={setShow} />
        {show && <AddPost />}
        <Posts />
      </div>
      <div className="w-full md:w-1/4">
        <RightSideBar />
      </div>
    </div>
  );
};

export default Home;
