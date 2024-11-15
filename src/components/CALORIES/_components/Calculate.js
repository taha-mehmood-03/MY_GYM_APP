import React from "react";
import { Input, Button, Card } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";
import useFormCal from "@/hooks/useFormCal";

const CustomForm = () => {
  const {
    formData,
    handleInputChange,
    handleSelectChange,
    handleSubmit
  } = useFormCal();

  return (
    <Card
      className="p-8 max-w-md mx-auto bg-gradient-to-br from-purple-900 to-indigo-900 shadow-lg rounded-lg"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <Input
          type="number"
          label="Age"
          placeholder="Enter your age"
          name="age"
          value={formData.age}
          onChange={handleInputChange}
          labelPlacement="outside"
          endContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-purple-400 text-sm">yrs</span>
            </div>
          }
          className="text-white bg-indigo-900 rounded" // Added text-white directly here
        />

        <Select
          variant="underlined"
          label="Gender"
          value={formData.sex}
          onChange={handleSelectChange}
          className="max-w-full text-white" // Ensure text is white here
        >
          <SelectItem value="male">Male</SelectItem>
          <SelectItem value="female">Female</SelectItem>
        </Select>

        <div className="flex space-x-4">
          <Input
            type="number"
            label="Feet"
            name="feet"
            placeholder="0"
            value={formData.feet}
            onChange={handleInputChange}
            labelPlacement="outside"
            endContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-purple-400 text-sm">ft</span>
              </div>
            }
            className="w-1/2 bg-indigo-900 text-white rounded" // Added text-white here
            min={0}
          />
          <Input
            type="number"
            label="Inches"
            name="inches"
            placeholder="0"
            value={formData.inches}
            onChange={handleInputChange}
            labelPlacement="outside"
            endContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-purple-400 text-sm">in</span>
              </div>
            }
            className="w-1/2 bg-indigo-900 text-white rounded" // Added text-white here
            max={11}
            min={0}
          />
        </div>

        <Input
          type="number"
          label="Weight"
          name="weight"
          placeholder="0"
          value={formData.weight}
          onChange={handleInputChange}
          labelPlacement="outside"
          endContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-purple-400 text-sm">lbs</span>
            </div>
          }
          className="bg-indigo-900 text-white rounded" // Added text-white here
          min={0}
        />

        <Button
          type="submit"
          className="w-full mt-6 bg-purple-700 text-white font-semibold py-3 rounded hover:bg-purple-800 transition-colors duration-300"
        >
          Submit
        </Button>
      </form>
    </Card>
  );
};

export default CustomForm;
