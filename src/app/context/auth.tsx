import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import React, { createContext, useState, ReactNode } from 'react';
// import { Navigate } from 'react-router-dom';

type IParamsLogin = {
    email: string,
    password: string
}

type AuthContextType = {
    user: string;
    userName: string;
    setUserName: React.Dispatch<React.SetStateAction<string>>;
    login: (params: IParamsLogin, isManual: boolean) => void;
    logout: () => void;
    error: string;
    notAuthStorage: boolean;
    setError: React.Dispatch<React.SetStateAction<string>>;
    setNotAuthStorage: React.Dispatch<React.SetStateAction<boolean>>;
    
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
    children: ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<string>('');
    const [userName, setUserName] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [notAuthStorage, setNotAuthStorage] = useState<boolean>(false);


    const _key = 'userCredential';

    

    const login = (params: IParamsLogin, isManual: boolean) => {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, params.email, params.password)
            .then((userCredential) => {

                const uid: string = userCredential.user.uid;
                setUser(uid);

                if (isManual) {
                    localStorage.setItem(_key, JSON.stringify(params));
                }
            })
            .catch((error) => {
                if (error.code == 'auth/invalid-credential') {
                    setError('Email ou senha inválidos');
                } else {
                    setError('Erro inesperado');
                }
                console.log('erro');
            });
    };

    const logout = () => {
        localStorage.removeItem(_key);
        setUser('');
    };

    return (
        <AuthContext.Provider value={{ user, userName, setUserName, login, logout, error, setError, notAuthStorage, setNotAuthStorage }}>
            {children}
        </AuthContext.Provider>
    );
};
