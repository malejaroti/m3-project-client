import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthContext } from '../context/auth.context';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import defaultAvatar from "../assets/default-avatar.jpg"
import api from '../services/config.services';
import type { IUser } from '../pages/UserProfilePage';



// Styled component for responsive navigation links
const NavLink = styled(Link)(() => ({
  textDecoration: 'none',
  color: 'inherit',
  '&:hover': {
    opacity: 0.8,
  },
}));

// Styled component for logout button
const LogoutButton = styled('button')(() => ({
  // alignSelf: 'flex-end',
  // background: 'linear-gradient(45deg, #ff6b6b, #ee5a52)',
  background: 'gray',
  border: 'none',
  borderRadius: '8px',
  padding: '8px 16px',
  cursor: 'pointer',
  color: 'white',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    background: 'linear-gradient(45deg, #ff5252, #e53935)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
    transform: 'translateY(-1px)',
  },
  '&:active': {
    transform: 'translateY(0)',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
}));

// Responsive font sizes for navbar links
const navLinkStyles = {
  fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
  fontWeight: 500
};

// Special styles for logout button text
const logoutButtonTextStyles = {
  ...navLinkStyles,
  color: 'blue', // Ensure text is always white on the button
};

function Navbar() {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error('This paged must be used within an AuthWrapper');
  }
  const { authenticateUser, isLoggedIn } = authContext;
  // const { authenticateUser, isLoggedIn, loggedUserPicture } = authContext;
  // console.log("Logged user picture:", loggedUserPicture)
  const [userData, setUserData] = useState<IUser | null>(null);

  useEffect(() => {
      getUserData();
  }, []);

  const getUserData = async () => {
      try {
      const response = await api.get('/user');
      console.log("user data", response)
      setUserData(response.data);
      } catch (error) {
      console.log(error);
      }
  };

  const handleLogout = async () => {
    // remove the token
    localStorage.removeItem('authToken');

    try {
      // update the context states
      await authenticateUser();

      // redirect to a public page
      navigate('/');
    } catch (error) {
      navigate('/error');
    }
  };

  return (
    <nav className="w-full justify-center items-center bg-slate-200 mb-5">
      <div className="flex justify-between items-center py-2 px-4">
        {/* Left side - Navigation links */}
        <ul className="flex gap-6 items-center w-full justify-around">
          {/* public links */}
          { !isLoggedIn &&
          <li>
            <NavLink to="/">
              <Typography variant="h6" sx={navLinkStyles}>
                Home
              </Typography>
            </NavLink>
          </li>
          }

          {/* anon links */}
          {!isLoggedIn && (
            <li>
              <NavLink to={'/sign-up'}>
                <Typography variant="h6" sx={navLinkStyles}>
                  Sign up
                </Typography>
              </NavLink>
            </li>
          )}
          {!isLoggedIn && (
            <li>
              <NavLink to={'/sign-in'}>
                <Typography variant="h6" sx={navLinkStyles}>
                  Sign in
                </Typography>
              </NavLink>
            </li>
          )}

          {/* private links */}
          {isLoggedIn && (
            <li>
              <NavLink to={'/lifetimeline'}>
                <Typography variant="h6" sx={navLinkStyles}>
                  Life timeline
                </Typography>
              </NavLink>
            </li>
          )}

          {isLoggedIn && (
            <li>
              <NavLink to={'/timelines'}>
                <Typography variant="h6" sx={navLinkStyles}>
                  Timelines
                </Typography>
              </NavLink>
            </li>
          )}
        </ul>
        
        {/* Right side of the navbar*/}
        <ul className='flex gap-6 items-center'>
          {/*  Logout button */}
          {isLoggedIn && (
            <Button variant='outlined' onClick={handleLogout}>
              <Typography variant="h6">
                Logout
              </Typography>
            </Button>
          )}

          {/* Profile picture */}
          {isLoggedIn && ( 
            <Link to={'/user-profile'}>
              <img src={userData?.profilePicture? userData?.profilePicture : defaultAvatar} alt="User picture or avatar" className='w-[60px] border-1 border-slate-500 aspect-square rounded-full object-cover'/>
              {/* <img src={loggedUserPicture? loggedUserPicture : defaultAvatar} alt="User picture or avatar" className='w-[60px] border-1 border-slate-500 aspect-square rounded-full object-cover'/> */}
            </Link>
          )}
        </ul>

      </div>
    </nav>
  );
}
export default Navbar;
