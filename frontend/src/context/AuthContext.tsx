import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../services/api';

interface User {
    _id: string;
    username: string;
    email: string;
    role: string;
    // Add other user properties as needed
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<any>;
    register: (username: string, email: string, password: string) => Promise<any>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        const token = localStorage.getItem('userToken');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            api.defaults.headers.common['x-auth-token'] = token;
            const res = await api.get('/me');
            setUser(res.data);
        } catch (err) {
            console.error('Failed to load user', err);
            localStorage.removeItem('userToken');
            delete api.defaults.headers.common['x-auth-token'];
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        const res = await api.post('/login', { email, password });
        localStorage.setItem('userToken', res.data.token);
        api.defaults.headers.common['x-auth-token'] = res.data.token;
        setUser(res.data.user);
        return res.data;
    };

    const register = async (username: string, email: string, password: string) => {
        const res = await api.post('/register', { username, email, password });
        localStorage.setItem('userToken', res.data.token);
        api.defaults.headers.common['x-auth-token'] = res.data.token;
        setUser(res.data.user);
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem('userToken');
        delete api.defaults.headers.common['x-auth-token'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
