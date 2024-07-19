import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import React, { createContext, useState, ReactNode, useContext } from 'react';
import { FirebaseContext } from './firebaseAppContext';
import { getToken } from 'firebase/messaging';
import { doc, updateDoc } from 'firebase/firestore';

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

    const firebaseContext = useContext(FirebaseContext);

    if (!firebaseContext) {
        throw new Error('useFirebase must be used within an FirebaseProvider');
    }

    const { messaging, db } = firebaseContext;


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

                    Notification.requestPermission().then((permission) => {
                        if (permission === 'granted') {
                            console.log('Notification permission granted.');

                            getToken(messaging, { vapidKey: 'BIJVYw_MI-ER7QdtxaQLE4d2f1whBOX19j2i38aw7pYi41hih6vjhU3mcklVhRH0onNLy_RC_lQKiH3frzya2jo' }).then((currentToken) => {
                                if (currentToken) {
                                    try {
                                        updateDoc(doc(db, "usuario", uid), {
                                            tokenMessage: currentToken,
                                        });

                                    } catch (e) {
                                        console.log('error firestore')
                                    }
                                } else {
                                    console.log('No registration token available. Request permission to generate one.');
                                }
                            }).catch((err) => {
                                console.log('An error occurred while retrieving token. ', err);
                            });
                        }
                    });

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
