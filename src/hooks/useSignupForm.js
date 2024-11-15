import { useState } from 'react';
import { useRouter } from 'next/router';
const useSignupForm = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
      email: '',
      password: '',
      currentWeight: '',
      targetWeight: '',
      message:"",
    
      
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
      const { email, password,currentWeight,targetWeight } = formData;
   console.log("formdata",formData)
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, currentWeight, targetWeight }),
      });
  
      const data = await res.json();
    
        console.log("moving to LOgin")
        // router.push('/Tologin');
       console.log(formData)
      
      setMessage(data.message);
    };
  
    return {
      formData,
      handleChange,
      handleSubmit,
      setMessage,
    };
  };

export default useSignupForm;
