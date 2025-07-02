import { NextUIProvider } from '@nextui-org/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@/app/globals.css';
import axios from 'axios';

// Axios interceptors for request and response
axios.interceptors.request.use(
  (config) => {
    // You can add custom logic here, like adding auth tokens
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    // You can add custom logic here for successful responses
    return response;
  },
  (error) => {
    // You can add custom error handling here
    return Promise.reject(error);
  }
);

// Create a Query Client instance with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <NextUIProvider>
        <Component {...pageProps} />
      </NextUIProvider>
    </QueryClientProvider>
  );
}

export default MyApp;