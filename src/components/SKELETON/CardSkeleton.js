// CardSkeleton.js
import React from "react";
import { Card, Skeleton } from "@nextui-org/react";

const CardSkeleton = ({
  imageClassName = "aspect-[4/3] w-full bg-gray-700",
  footerClassName = "absolute bottom-0 w-full bg-black/60 border-t border-gray-600 p-6",
  containerClassName = "flex justify-center w-full animate-pulse",
  cardClassName = "w-full max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl bg-gray-800 border border-gray-700 shadow-lg rounded-lg overflow-hidden mx-auto relative"
}) => {
  return (
    <div className={containerClassName}>
      <Card className={cardClassName}>
        {/* Image skeleton with responsive height */}
        <div className="relative w-full">
          <div className={imageClassName} />
        </div>
        
        {/* Footer skeleton */}
        <div className={footerClassName}>
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-2">
              {/* Logo skeleton */}
              <Skeleton className="rounded-full w-10 h-11 bg-gray-700" />
              
              {/* Text skeletons */}
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-20 rounded-lg bg-gray-700" />
                <Skeleton className="h-6 w-32 rounded-lg bg-gray-700" />
              </div>
            </div>
            
            {/* Button skeleton */}
            <Skeleton className="rounded-full w-16 h-8 bg-gray-700" />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CardSkeleton;
