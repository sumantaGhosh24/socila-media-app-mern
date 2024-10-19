import {Navigate, useLocation} from "react-router-dom";

import {useAuth} from "../hooks";

const UserAuth = ({elm}) => {
  const {user, isLoading} = useAuth();
  const location = useLocation();

  if (isLoading) return null;

  let content;

  if (user) {
    content = elm;
  } else {
    content = <Navigate to="/login" state={{from: location}} replace />;
  }

  return content;
};

export default UserAuth;
