import React, { useEffect, useState, useContext } from 'react';

const initialState = {
    Id: null,
    Token: null,
    Role: null,
    IsLogIn: localStorage.getItem('IsLogIn'),
    login: () => { },
    logout: () => { },
};

const AuthContext = React.createContext(initialState);

export const AuthProvider = ({ children }) => {

    const [Id, setId] = useState(null);
    const [Token, setToken] = useState(null);
    const [Role, setRole] = useState(null);
    const [IsLogIn, setIsLogIn] = useState(localStorage.getItem('IsLogIn'));

    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === 'IsLogIn' && (event.newValue === 'false' || event.newValue === 'true' || event.newValue === null)) {
                // window.location.reload();
                window.location.href = '/';
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [IsLogIn]);

    useEffect(() => {
        const UserId = localStorage.getItem('UserId');
        const Token = localStorage.getItem('Token');
        const UserRole = localStorage.getItem('UserRole');

        setId(UserId);
        setToken(Token);
        setRole(UserRole);
    }, [IsLogIn]);

    const login = () => {
        console.log('login');
        localStorage.removeItem('IsLogIn');
        localStorage.setItem('IsLogIn', 'true');
        setIsLogIn(true);
    };

    const logout = () => {
        console.log('logout');
        localStorage.removeItem('Token');
        localStorage.removeItem('UserId');
        localStorage.removeItem('UserRole');
        localStorage.removeItem('IsLogIn');
        localStorage.setItem('IsLogIn', 'false');
        setIsLogIn(false);
    };

    return (
        <AuthContext.Provider value={{ login, logout, Id, Token, Role, IsLogIn }}>
            {children}
        </AuthContext.Provider>
    );
}

export const UserAuth = () => {
    return useContext(AuthContext)
}
