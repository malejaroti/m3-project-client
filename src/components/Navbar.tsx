import { useContext } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthContext } from '../context/auth.context';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

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
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: 'inherit',
  '&:hover': {
    opacity: 0.8,
  },
}));

// Responsive font sizes for navbar links
const navLinkStyles = {
  fontSize: { xs: '1rem', sm: '1.1rem', md: '1.5rem' },
  fontWeight: 500
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
    <nav className="w-full border-2 justify-center items-center border-mint-500 bg-amber-200">
      <ul className="flex justify-around border-2 items-center py-2">
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
        {isLoggedIn && (
          <li>
            <LogoutButton onClick={handleLogout}>
              <Typography variant="h6" sx={navLinkStyles}>
                Logout
              </Typography>
            </LogoutButton>
          </li>
        )}
      </ul>
    </nav>
  );
}
export default Navbar;
