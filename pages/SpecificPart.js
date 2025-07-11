import dynamic from "next/dynamic";
import { Suspense } from "react";
import ClientOnly from '@/components/ClientOnly';

// Dynamically import the BodyPart component to reduce initial bundle size
const DynamicBodyPart = dynamic(
  () => import("@/components/SpecificBody/BodyPart"),
  {
    suspense: true,
    loading: () => <div>Loading BodyPart...</div>,
  }
);

import NavTwo from "@/components/NAVBAR/NavTwo";

export default function SpecificPart() {
  return (
    <ClientOnly fallback={<div>Loading...</div>}>
      <div className="min-h-screen bg-black text-white">
        <NavTwo />
        <main className="py-8 px-4 ">
          <Suspense fallback={<div>Loading BodyPart...</div>}>
            <DynamicBodyPart />
          </Suspense>
        </main>
      </div>
    </ClientOnly>
  );
}
