import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  element: JSX.Element;
  allowedRoles?: number[];
}

const PrivateRoute = ({ element, allowedRoles }: PrivateRouteProps) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!token) {
    return <Navigate to="/unauthorized" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return element;
};

export default PrivateRoute;