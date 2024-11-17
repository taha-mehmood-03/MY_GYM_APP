import { Input, Button } from '@nextui-org/react';
import Link from 'next/link';
import useSignupForm from '@/hooks/useSignupForm';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

function Login() {
  const { formData, handleChange } = useSignupForm();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const [errorField, setErrorField] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Handle specific errors
        if (data.message === 'User not found') {
          setErrorField('email');
          setErrorMessage('Email not found. Please check your email.');
        } else if (data.message === 'Invalid credentials') {
          setErrorField('password');
          setErrorMessage('Incorrect password. Please try again.');
        }
        return;
      }

      // Clear errors on success
      setErrorField('');
      setErrorMessage('');
      console.log('Login successful');

      // Redirect to MainPage
      router.push('/MainPage');
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="flex flex-col items-center p-6 mx-auto bg-black bg-opacity-50 backdrop-blur-md backdrop-filter rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-center text-white mb-4">
        Gym Transformation Challenge
      </h2>
      {errorMessage && (
        <div className="text-red-500 bg-red-100 p-2 rounded-lg mb-4 text-center w-[80%]">
          {errorMessage}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full items-center"
      >
        <Input
          type="email"
          label="Email"
          name="email"
          labelPlacement="outside"
          radius="sm"
          color={errorField === 'email' ? 'error' : 'white'}
          size="lg"
          className="w-[80%] text-white"
          variant="bordered"
          status={errorField === 'email' ? 'error' : undefined}
          onChange={handleChange}
        />
        <Input
          type="password"
          label="Password"
          name="password"
          labelPlacement="outside"
          className="w-[80%] text-white"
          radius="sm"
          color={errorField === 'password' ? 'error' : 'white'}
          variant="bordered"
          size="lg"
          status={errorField === 'password' ? 'error' : undefined}
          onChange={handleChange}
        />
        <Button
          type="submit"
          variant="solid"
          className="w-[40%] bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-purple-500/25 rounded-lg py-6 text-lg tracking-wide"
          size="lg"
        >
          Sign In
        </Button>
        <p className="text-white mt-4">
          Don’t have an account?{' '}
          <Link href="/signup" className="text-indigo-400 hover:text-indigo-500">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
