import { createContext, useState, useEffect } from "react";
import { login, register } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');
            if (storedToken && storedToken !== 'undefined' && storedToken !== 'null') {
                setToken(storedToken);
            }
            if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error('Error loading user from local storage:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        } finally {
            setLoading(false);
        }
    }, []);

    const loginUser = async (username, password) => {
        setLoading(true);
        try {
            const response = await login(username, password);
            setUser(response.user);
            setToken(response.token);
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            return { success: true, message: 'Login successful' };
        } catch (error) {
            console.error('Error logging in:', error);
            return { success: false, message: 'Invalid credentials' };
        } finally {
            setLoading(false);
        }
    };

    const registerUser = async (username, password) => {
        setLoading(true);
        try {
            const response = await register(username, password);
            setUser(response.user);
            setToken(response.token);
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            return { success: true, message: 'Registration successful' };
        } catch (error) {
            console.error('Error registering:', error);
            return { success: false, message: 'Invalid credentials' };
        } finally {
            setLoading(false);
        }
    };

    const logoutUser = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, loginUser, registerUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
}