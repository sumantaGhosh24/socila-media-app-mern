import {Navigate, useLocation} from "react-router-dom";

import {useAuth} from "../hooks";

const GuestAuth = ({elm}) => {
  const {user, isLoading} = useAuth();
  const location = useLocation();

  if (isLoading) return null;

  let content;

  if (user) {
    content = <Navigate to="/" state={{from: location}} replace />;
  } else {
    content = elm;
  }

  return content;
};

export default GuestAuth;
