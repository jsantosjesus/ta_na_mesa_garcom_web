import React, { createContext, ReactNode } from 'react';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../../firebaseConfig';
import { Firestore, getFirestore } from 'firebase/firestore';
import { getMessaging, Messaging } from 'firebase/messaging';

type IFirebasseAppContext = {
    app: FirebaseApp
    db: Firestore
    messaging: Messaging
}

type IFirebaseAppProviderProps = {
    children: ReactNode;
};

// Criação do contexto
export const FirebaseContext = createContext<IFirebasseAppContext | undefined>(undefined);

// Inicialização do app Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const messaging = getMessaging(app);

// Componente Provider
export const FirebaseProvider: React.FC<IFirebaseAppProviderProps> = ({ children }) => {
  return (
    <FirebaseContext.Provider value={{app, db, messaging}}>
      {children}
    </FirebaseContext.Provider>
  );
};