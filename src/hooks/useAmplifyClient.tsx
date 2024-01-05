import { AmplifyClientContext } from '@/providers/amplify-client-provider';
import  { useContext } from 'react';

// Define the context

// Custom hook to use the context
export const useAmplifyClient = () => useContext(AmplifyClientContext);
