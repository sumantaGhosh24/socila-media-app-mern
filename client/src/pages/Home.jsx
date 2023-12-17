import {useEffect} from "react";

import {Status, Posts, RightSideBar, AddPost} from "../components/";
import {useTitle} from "../hooks";

let scroll = 0;

const Home = () => {
  useTitle("Home");

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
    <div className="container mx-auto">
      <div>
        <Status />
        <AddPost />
        <Posts />
      </div>
      <div>
        <RightSideBar />
      </div>
    </div>
  );
};

export default Home;
