import api from '../services/config.services';
import { createContext, useEffect, useState } from 'react';
import { type ReactNode } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  loggedUserId: string | null;
  authenticateUser: () => Promise<void>;
}

interface AuthWrapperProps {
  children: ReactNode;
}
// context component (component that sends the state contexts and functions)
const AuthContext = createContext<AuthContextType | null>(null);

// wrapper component (component that holds the states and functions to be shared)
function AuthWrapper(props: AuthWrapperProps) {
  // context states and functions
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loggedUserId, setLoggedUserId] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(true);

  useEffect(() => {
    // at the start of the app, validate the user token
    authenticateUser();
  }, []);

  const authenticateUser = async (): Promise<void> => {
    // this is the function that sends the token to the backend to verify its validity and receives info about the owner of that token

    try {
      const response = await api.get('/auth/verify');

      // if we get to this point it means that the backend validated the token
      console.log(response);
      setIsLoggedIn(true);
      setLoggedUserId(response.data._id);
      setIsAuthenticating(false);
    } catch (error) {
      // if we go into the catch it means that the backend rejected the token
      console.log(error);
      setIsLoggedIn(false);
      setLoggedUserId(null);
      setIsAuthenticating(false);
    }
  };

  const passedContext: AuthContextType = {
    isLoggedIn,
    loggedUserId,
    authenticateUser,
  };

  if (isAuthenticating) {
    return <h3>Authenticating User...</h3>;
  }

  return (
    <AuthContext.Provider value={passedContext}>
      {props.children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthWrapper };
