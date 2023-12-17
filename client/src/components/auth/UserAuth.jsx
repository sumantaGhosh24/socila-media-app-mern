import {Navigate, useLocation} from "react-router-dom";
import propTypes from "prop-types";

import {useAuth} from "../../hooks";
import Loading from "../alert/Loading";

const UserAuth = ({elm}) => {
  const {user, isLoading} = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loading />;
  }

  let content;

  if (user) {
    content = elm;
  } else {
    content = <Navigate to="/login" state={{from: location}} replace />;
  }

  return content;
};

UserAuth.propTypes = {
  elm: propTypes.any,
};

export default UserAuth;
