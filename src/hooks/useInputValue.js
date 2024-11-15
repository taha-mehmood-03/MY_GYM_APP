import { useState, useCallback } from 'react';

// Custom hook for managing input value with a callback
const useInputValue = (initialValue = '', onChangeCallback = () => {}) => {
  const [value, setValue] = useState(initialValue);

  // Handler for input change
  const handleChange = useCallback((event) => {
    const newValue = event.target.value;
    setValue(newValue);
    onChangeCallback(newValue); // Call the callback with the new value
  }, [onChangeCallback]);



  

  return {
    value,
    onChange: handleChange,
  };
};

export default useInputValue;


