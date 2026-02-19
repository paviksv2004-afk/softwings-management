import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // check if JWT exists
  return token ? children : <Navigate to="/signin" />;
};

export default PrivateRoute;
