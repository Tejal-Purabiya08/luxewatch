import { Navigate } from "react-router-dom";

function AdminPrivate({ children }) {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  return user?.role === "admin"
    ? children
    : <Navigate to="/" />;
}

export default AdminPrivate;