import {Navigate, useLocation} from "react-router-dom";
import propTypes from "prop-types";

import {useAuth} from "../../hooks";
import Loading from "../alert/Loading";

const GuestAuth = ({elm}) => {
  const {user, isLoading} = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loading />;
  }

  let content;

  if (user) {
    content = <Navigate to="/" state={{from: location}} replace />;
  } else {
    content = elm;
  }

  return content;
};

GuestAuth.propTypes = {
  elm: propTypes.any,
};

export default GuestAuth;
