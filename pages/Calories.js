import React from 'react';
import Cal from '@/components/CALORIES/Cal';
import Calculate from '@/components/CALORIES/_components/Calculate';
import NavTwo from '@/components/NAVBAR/NavTwo';
import ClientOnly from '@/components/ClientOnly';

export default function Calories() {
  return (
    <ClientOnly fallback={<div>Loading...</div>}>
      <div className="calories-container min-h-screen bg-black flex flex-col items-center py-10">
        <NavTwo/>
        <div className="w-full max-w-4xl p-4  rounded-lg shadow-lg">
          <Calculate />
        </div>
        <div className="w-full max-w-4xl mt-6 p-4  rounded-lg shadow-lg">
          <Cal />
        </div>
      </div>
    </ClientOnly>
  );
}
