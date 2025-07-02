import { useEffect, useState } from 'react';

export default function ClientOnly({ children, fallback = null }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Show fallback during SSR and initial hydration
  if (!hasMounted) {
    return fallback;
  }

  // Only render children after hydration is complete
  return children;
} 