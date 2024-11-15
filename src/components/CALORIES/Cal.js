import React from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner } from "@nextui-org/react";
import { useSelector } from 'react-redux';

export default function Cal() {
  const { caloriesData, status, error } = useSelector((state) => state.calories);

  if (status === 'loading') return <Spinner label="Loading..." />;
  if (status === 'failed') return <div className="text-red-500 font-semibold">Error: {error}</div>;

  return (
    <div className="container mx-auto p-8 min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 text-white">
      {caloriesData?.macronutrients_table && (
        <section className="mb-8 bg-gradient-to-br from-purple-900 to-indigo-900 shadow-xl rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-white">Macronutrients</h2>
          <Table aria-label="Macronutrients Table" className="min-w-full table-auto">
            <TableHeader className="bg-gradient-to-br from-purple-900 to-indigo-900">
              <TableColumn className="text-black font-medium">Nutrient</TableColumn>
              <TableColumn className="text-black font-medium">Value</TableColumn>
            </TableHeader>
            <TableBody>
              {caloriesData.macronutrients_table["macronutrients-table"].map((row, index) => (
                <TableRow key={index} className={`${index % 2 === 0 ? 'bg-gradient-to-br from-purple-900 to-indigo-900' : 'bg-gradient-to-br from-purple-900 to-indigo-900'}`}>
                  <TableCell className="p-4">{row[0]}</TableCell>
                  <TableCell className="p-4">{row[1]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      )}

      {caloriesData?.vitamins_table && (
        <section className="mb-8 bg-gradient-to-br from-purple-900 to-indigo-900 shadow-xl rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-white">Vitamins</h2>
          <Table aria-label="Vitamins Table" className="min-w-full table-auto">
            <TableHeader className="bg-gradient-to-br from-purple-900 to-indigo-900">
              <TableColumn className="text-black font-medium">Vitamin</TableColumn>
              <TableColumn className="text-black font-medium">Value</TableColumn>
            </TableHeader>
            <TableBody>
              {caloriesData.vitamins_table["vitamins-table"].map((row, index) => (
                <TableRow key={index} className={`${index % 2 === 0 ? 'bg-gradient-to-br from-purple-900 to-indigo-900' : 'bg-gradient-to-br from-purple-900 to-indigo-900'}`}>
                  <TableCell className="p-4">{row[0]}</TableCell>
                  <TableCell className="p-4">{row[1]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      )}

      {caloriesData?.minerals_table && (
        <section className="mb-8 bg-gradient-to-br from-purple-900 to-indigo-900 shadow-xl rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-white">Essential Minerals</h2>
          <Table aria-label="Essential Minerals Table" className="min-w-full table-auto">
            <TableHeader className="bg-gradient-to-br from-purple-900 to-indigo-900">
              <TableColumn className="text-black font-medium">Mineral</TableColumn>
              <TableColumn className="text-black font-medium">Value</TableColumn>
            </TableHeader>
            <TableBody>
              {caloriesData.minerals_table["essential-minerals-table"].map((row, index) => (
                <TableRow key={index} className={`${index % 2 === 0 ? 'bg-gradient-to-br from-purple-900 to-indigo-900' : 'bg-gradient-to-br from-purple-900 to-indigo-900'}`}>
                  <TableCell className="p-4">{row[0]}</TableCell>
                  <TableCell className="p-4">{row[1]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      )}

      {caloriesData?.non_essential_minerals_table && (
        <section className="mb-8 bg-gradient-to-br from-purple-900 to-indigo-900 shadow-xl rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-white">Non-Essential Minerals</h2>
          <Table aria-label="Non-Essential Minerals Table" className="min-w-full table-auto">
            <TableHeader className="bg-gradient-to-br from-purple-900 to-indigo-900">
              <TableColumn className="text-black font-medium">Mineral</TableColumn>
              <TableColumn className="text-black font-medium">Value</TableColumn>
            </TableHeader>
            <TableBody>
              {caloriesData.non_essential_minerals_table["non-essential-minerals-table"].map((row, index) => (
                <TableRow key={index} className={`${index % 2 === 0 ? 'bg-gradient-to-br from-purple-900 to-indigo-900' : 'bg-gradient-to-br from-purple-900 to-indigo-900'}`}>
                  <TableCell className="p-4">{row[0]}</TableCell>
                  <TableCell className="p-4">{row[1]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      )}

      {caloriesData?.BMI_EER && (
        <section className="mb-8 bg-gradient-to-br from-purple-900 to-indigo-900 shadow-xl rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-white">BMI and Caloric Needs</h2>
          <Table aria-label="BMI Table" className="min-w-full table-auto">
            <TableHeader className="bg-gradient-to-br from-purple-900 to-indigo-900">
              <TableColumn className="text-black font-medium">BMI</TableColumn>
              <TableColumn className="text-black font-medium">Estimated Daily Caloric Needs</TableColumn>
            </TableHeader>
            <TableBody>
              <TableRow className="bg-gradient-to-br from-purple-900 to-indigo-900">
                <TableCell className="p-4">{caloriesData.BMI_EER.BMI}</TableCell>
                <TableCell className="p-4">{caloriesData.BMI_EER["Estimated Daily Caloric Needs"]}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </section>
      )}
    </div>
  );
}
