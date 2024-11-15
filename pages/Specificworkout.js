import React, { Suspense, lazy } from "react";
import { WorkoutProvider } from "@/utils/WorkoutContext";

// Lazy load the SpecificExercise component
const SpecificExercise = lazy(() => import("@/components/SpecificExercise/SpecificExercise"));

export default function Specificworkout() {
    return (
        <WorkoutProvider>
            <Suspense fallback={  <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gray-400"></div>
    </div>}>
                <SpecificExercise />
            </Suspense>
        </WorkoutProvider>
    );
}
