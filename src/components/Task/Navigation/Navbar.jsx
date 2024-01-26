import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useFirebase } from '../../../contexts/FirebaseContext';
import { useAuth } from '../../../contexts/AuthContext';
import { useState } from 'react';

const Navbar = () => {
  const { currentUser } = useFirebase();
  const { logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Don't show navbar on login and register pages
  if (['/login'].includes(location.pathname)) {
    return null;
  }

  return (
    <nav className="sticky p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-lg font-bold">Task Hub</Link>

        <div className="flex items-center space-x-4">
          <button onClick={toggleMenu} className="md:hidden text-white">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>

          <div className={`md:flex ${menuOpen ? 'flex-col' : 'hidden'} space-x-4`}>
            <Link to="/tasklist" className="text-white hover:text-gray-300">Tasks</Link>
            <Link to="/taskform" className="text-white hover:text-gray-300">Add Task</Link>
            <Link to="/register" className="text-white hover:text-gray-300">Register</Link>

            {currentUser ? (
              <button
                onClick={handleLogout}
                className="text-white hover:text-gray-300"
              >
                Logout
              </button>
            ) : (
              <Link to="/login" className="text-white hover:text-gray-300">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
