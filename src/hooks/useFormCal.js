import { useState } from 'react';
import { useCalculateCalories } from '@/hooks/useOptimizedQueries';

const useFormCal = () => {
  const [formData, setFormData] = useState({
    age: '',
    sex: 'male',
    feet: '',
    inches: '',
    weight: '',
  });

  const calculateCaloriesMutation = useCalculateCalories();

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
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    
    // Use the optimized calories calculation mutation
    calculateCaloriesMutation.mutate(formData);
  };

  return {
    formData,
    handleInputChange,
    handleSelectChange,
    handleSubmit,
    isLoading: calculateCaloriesMutation.isPending,
    error: calculateCaloriesMutation.error,
  };
};

export default useFormCal;
