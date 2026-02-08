import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/authContext.jsx";

const AuthProtected = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    if (loading) {
        return <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            fontSize: '1.5rem',
            color: '#fff',
            backgroundColor: '#000'
        }}>Loading...</div>;
    }
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default AuthProtected;