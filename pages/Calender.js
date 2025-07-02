import React, { Suspense, lazy } from "react";
import NavTwo from "@/components/NAVBAR/NavTwo";
import ClientOnly from '@/components/ClientOnly';

// Lazy load the Plan component
const Plan = lazy(() => import('@/components/PLAN/Plan'));

export default function Calender() {
  return (
    <ClientOnly fallback={<div>Loading...</div>}>
      <div className="bg-black min-h-screen"> {/* Ensuring the outer div is black */}
        <NavTwo /> {/* Include NavTwo at the top */}
        <Suspense 
          fallback={
            <div className="flex items-center justify-center h-screen">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
            </div>
          }
        >
          <Plan />
        </Suspense>
      </div>
    </ClientOnly>
  );
}
