import { Navigate } from "react-router-dom";

function UserPrivate({ children }) {

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    return user
        ? children
        : <Navigate to="/" />;
}

export default UserPrivate;