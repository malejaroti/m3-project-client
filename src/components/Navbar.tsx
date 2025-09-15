import { useContext } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthContext } from '../context/auth.context';

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
    <nav className="w-full border-2 justify-center items-center  border-mint-500 bg-amber-200">
      <ul className="flex justify-around border-2">
        {/* public links */}
        <Link to="/">Home</Link>

        {/* anon links */}
        {!isLoggedIn && <Link to={'/sign-up'}>Sign up </Link>}
        {!isLoggedIn && <Link to={'/sign-in'}>Sign in </Link>}

        {/* private links */}
        {isLoggedIn && <Link to={'/timelines'}>Timelines</Link>}
        {isLoggedIn && (
          <button onClick={handleLogout} className="text-blue-500 underline">
            Logout
          </button>
        )}
      </ul>
    </nav>
  );
}
export default Navbar;
