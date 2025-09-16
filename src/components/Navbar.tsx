import { useContext } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthContext } from '../context/auth.context';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

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
  fontSize: { xs: '1rem', sm: '1.1rem', md: '1.5rem' },
  fontWeight: 500
};

// Special styles for logout button text
const logoutButtonTextStyles = {
  ...navLinkStyles,
  color: 'white', // Ensure text is always white on the button
};

function Navbar() {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error('This paged must be used within an AuthWrapper');
  }

  const { authenticateUser, isLoggedIn } = authContext;

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
    <nav className="w-full border-2 justify-center items-center border-mint-500 bg-slate-200">
      <div className="flex justify-between items-center py-2 px-4">
        {/* Left side - Navigation links */}
        <ul className="flex gap-6 items-center w-full justify-around">
          {/* public links */}
          <li>
            <NavLink to="/">
              <Typography variant="h6" sx={navLinkStyles}>
                Home
              </Typography>
            </NavLink>
          </li>

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
              <NavLink to={'/timelines'}>
                <Typography variant="h6" sx={navLinkStyles}>
                  Timelines
                </Typography>
              </NavLink>
            </li>
          )}
        </ul>

        {/* Right side - Logout button */}
        {isLoggedIn && (
          <Button variant='outlined' onClick={handleLogout}>
            <Typography variant="h6" sx={logoutButtonTextStyles}>
              Logout
            </Typography>
          </Button>
        )}
      </div>
    </nav>
  );
}
export default Navbar;
