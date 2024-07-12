import React, { ReactNode, useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../app/pages/login';
import Home from '../app/pages/home';
import { AuthContext } from '../app/context/auth';
import Splash from '../app/pages/splash';

interface PrivateProps {
  children: ReactNode;
  isLoginPage: boolean;
}

const Private: React.FC<PrivateProps> = ({ children, isLoginPage }) => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { user, notAuthStorage } = authContext;
  
  if (!isLoginPage && !user && !notAuthStorage){
    return <Navigate to="/splash" />
  }

  if (!isLoginPage && !user && notAuthStorage) {
    return <Navigate to="/login" />;
  }

  if (isLoginPage && user) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

const Rotas: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <Private isLoginPage={true}>
            <Login />
          </Private>
        }
      />
      <Route
        path="/splash"
        element={
          <Private isLoginPage={true}>
            <Splash />
          </Private>
        }
      />
      <Route
        path="/"
        element={
          <Private isLoginPage={false}>
            <Home />
          </Private>
        }
      />
    </Routes>
  );
};

export default Rotas;
