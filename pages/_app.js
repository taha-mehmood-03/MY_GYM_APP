import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { NextUIProvider } from '@nextui-org/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RootLayout from '@/app/layout';
import { store, persistor } from '../src/STORE/store';
import '../src/app/globals.css';
import axios from 'axios';

// Configure Axios defaults


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

// Create a Query Client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
        
          <NextUIProvider>
            <RootLayout>
              <Component {...pageProps} />
            </RootLayout>
          </NextUIProvider>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}

export default MyApp;