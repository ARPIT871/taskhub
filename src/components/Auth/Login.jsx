import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { object, string } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

const LoginSchema = object({
  email: string().email(),
  password: string().min(6),
});

const Login = () => {
  const { loginUser } = useAuth();
  const { handleSubmit, register, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(LoginSchema),
  });
  const [authError, setAuthError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setAuthError('');
      const response = await loginUser(data.email, data.password);
      navigate('/');

      // Redirect or handle successful login
    } catch (error) {
      console.log(error);
      setAuthError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center   text-white">
      <div className="max-w-md w-full p-6 space-y-8 border border-white rounded-lg">
        <h2 className="text-3xl font-bold text-center">Login</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              autoComplete="email"
              required
              className="mt-1 p-2 w-full text-black border rounded focus:outline-none focus:ring focus:border-blue-300"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              {...register('password')}
              type="password"
              autoComplete="current-password"
              required
              className="mt-1 p-2 w-full text-black border rounded focus:outline-none focus:ring focus:border-blue-300"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {authError && <p className="text-red-500 text-sm">{authError}</p>}

          <div>
            <button
              type="submit"
              className="w-full p-2 bg-white text-black rounded focus:outline-none hover:bg-gray-300 transition duration-300 ease-in-out"
            >
              Login
            </button>
          </div>
        </form>

        <p className="text-sm text-center text-gray-300">
          Don't have an account? <Link to="/register" className="text-white hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
