import { createContext, useState, useEffect } from 'react';
import {getUserInfo} from "../services/api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (!token) {
            localStorage.removeItem('token');
        } else {
            localStorage.setItem('token', token);
            getUserInfo(token).then(data2 => {
                setUser(data2)
                console.log(data2)
            })
        }
    }, [token]);



    return (
        <AuthContext.Provider value={{ token, setToken, user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}
