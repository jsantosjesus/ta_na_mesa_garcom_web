import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import React, { createContext, useState, ReactNode } from 'react';

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
    loading: boolean;
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
    const [loading, setLoading] = useState<boolean>(false);


    const _key = 'userCredential';

    

    const login = (params: IParamsLogin, isManual: boolean) => {
        setLoading(true);
        const auth = getAuth();
        signInWithEmailAndPassword(auth, params.email, params.password)
            .then((userCredential) => {
                setLoading(false);
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
                setLoading(false);
            });

    };

    const logout = () => {
        
        const auth = getAuth();

        signOut(auth).then(() => {
            localStorage.removeItem(_key);
            setUser('');
          }).catch(() => {
            // console.log('error');
            localStorage.removeItem(_key);
            setUser('');
          });
    };

    return (
        <AuthContext.Provider value={{ user, userName, setUserName, login, logout, error, setError, notAuthStorage, loading, setNotAuthStorage }}>
            {children}
        </AuthContext.Provider>
    );
};
