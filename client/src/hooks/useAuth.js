import {useSelector} from "react-redux";
import jwtDecode from "jwt-decode";

const useAuth = () => {
  const {user, isLoading, isError, isSuccess, message} = useSelector(
    (state) => state.auth
  );

  if (user) {
    const decoded = jwtDecode(user.accessToken);
    const {email, id} = decoded.UserInfo;
    return {user, email, id, isLoading, isError, isSuccess, message};
  }

  return {
    user,
    email: "",
    id: "",
    isLoading,
    isError,
    isSuccess,
    message,
  };
};

export default useAuth;
