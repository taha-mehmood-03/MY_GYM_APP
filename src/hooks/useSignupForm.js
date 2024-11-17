import { useState } from 'react';
import { useRouter } from 'next/router';

const useSignupForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    currentWeight: '',
    targetWeight: '',
    message: '', // To store response messages from the server
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const setMessage = (message) => {
    setFormData((prevData) => ({
      ...prevData,
      message,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, currentWeight, targetWeight } = formData;

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, currentWeight, targetWeight }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Handle error messages from the server
        setMessage(data.message || 'An error occurred during registration.');
        return;
      }

      // If registration is successful, set success message
      setMessage(data.message || 'Registration successful!');
      
      // Redirect user to login page
      router.push('/Tologin');
    } catch (error) {
      console.error('Error during registration:', error);
      setMessage('An error occurred. Please try again later.');
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    setMessage,
  };
};

export default useSignupForm;
