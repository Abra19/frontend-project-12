import React, { useState, useMemo } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { Button, Navbar, Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';

import AuthContext from '../contexts/index.js';
import useAuth from '../hooks/auth.js';
import routes from '../routes.js';

import ChatPage from './ChatPage.jsx';
import LoginPage from './LoginPage.jsx';
import Signup from './Signup.jsx';
import NotFound from './NotFound.jsx';

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('userdatas');
    setLoggedIn(false);
  };

  const memoAuth = useMemo(() => ({ loggedIn, logIn, logOut }), [loggedIn]);

  return (
    <AuthContext.Provider value={memoAuth}>
      {children}
    </AuthContext.Provider>
  );
};

const PrivateRoute = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();

  return (
    auth.loggedIn ? children : <Navigate to="/login" state={{ from: location }} />
  );
};

const AuthButton = () => {
  const auth = useAuth();
  const { t } = useTranslation();

  return (
    auth.loggedIn ? <Button onClick={auth.logOut}>{t('exit')}</Button> : ''
  );
};

const App = () => {
  const { t } = useTranslation();
  return (
    <AuthProvider>
      <div className="d-flex flex-column h-100">
        <Router>
          <Navbar expand="lg" variant="light" bg="white" className="shadow-sm">
            <Container>
              <Navbar.Brand as={Link} to="/">{t('name')}</Navbar.Brand>
              <AuthButton />
            </Container>
          </Navbar>
          <ToastContainer />
          <Routes>
            <Route
              path={routes.chatPagePath()}
              element={(
                <PrivateRoute>
                  <ChatPage />
                </PrivateRoute>
              )}
            />
            <Route path={routes.loginPagePath()} element={<LoginPage />} />
            <Route path={routes.signupPagePath()} element={<Signup />} />
            <Route path={routes.notFoundPath()} element={<NotFound />} />
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
};

export default App;