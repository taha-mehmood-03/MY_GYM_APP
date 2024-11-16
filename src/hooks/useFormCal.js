import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCalories } from '@/STORE/caloriesSlice'; // Adjust the path accordingly

const useFormCal = () => {
  const [formData, setFormData] = useState({
    age: '',
    sex: 'male',
    feet: '',
    inches: '',
    weight: '',
  });

  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (value, name) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,  // Ensure `value` is the correct type
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Log formData to verify the values
    console.log("Form Data:", formData);
    dispatch(fetchCalories(formData));
  };

  return {
    formData,
    handleInputChange,
    handleSelectChange,
    handleSubmit,
  };
};

export default useFormCal;
