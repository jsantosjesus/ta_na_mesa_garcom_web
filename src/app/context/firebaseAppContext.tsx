import React, { createContext, ReactNode } from 'react';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../firebaseConfig';
import { Firestore, getFirestore } from 'firebase/firestore';

type IFirebasseAppContext = {
    app: FirebaseApp
    db: Firestore
}

type IFirebaseAppProviderProps = {
    children: ReactNode;
};

// Criação do contexto
export const FirebaseContext = createContext<IFirebasseAppContext | undefined>(undefined);

// Inicialização do app Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Componente Provider
export const FirebaseProvider: React.FC<IFirebaseAppProviderProps> = ({ children }) => {
  return (
    <FirebaseContext.Provider value={{app, db}}>
      {children}
    </FirebaseContext.Provider>
  );
};