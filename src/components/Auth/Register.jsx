import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { object, string } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';

const RegisterSchema = object({
  email: string().email(),
  password: string().min(6),
  confirmPassword: string().refine(data => data.confirmPassword === data.password, {
    message: 'Passwords do not match',
  }),
});

const Register = () => {
  const { registerUser } = useAuth();
  const { handleSubmit, register, formState: { errors } } = useForm({
    resolver: zodResolver(RegisterSchema),
  });

  const [authError, setAuthError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setAuthError('');
      await registerUser(data.email, data.password);
      navigate('/login');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setAuthError('Email already in use');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  text-white">
      <div className="max-w-md w-full p-6 space-y-8 border border-white rounded-lg">
        <h2 className="text-3xl font-bold text-center text-white">Register</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">Email</label>
            <input {...register('email')} type="email" autoComplete="email" required className="mt-1 p-2 w-full text-black border rounded focus:outline-none focus:ring focus:border-blue-300" />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">Password</label>
            <input {...register('password')} type="password" autoComplete="new-password" required className="mt-1 text-black p-2 w-full border rounded focus:outline-none focus:ring focus:border-blue-300" />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium">Confirm Password</label>
            <input {...register('confirmPassword')} type="password" autoComplete="new-password" required className="mt-1 text-black p-2 w-full border rounded focus:outline-none focus:ring focus:border-blue-300" />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>

          {authError && <p className="text-red-500 text-sm">{authError}</p>}

          <div>
            <button type="submit" className="w-full p-2 bg-white text-black rounded focus:outline-none hover:bg-green-500 transition duration-300 ease-in-out">Register</button>
          </div>
        </form>

        <p className="text-sm text-center text-gray-300">
          Already have an account? <Link to="/login" className="text-white hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
