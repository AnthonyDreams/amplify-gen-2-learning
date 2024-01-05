import { UserAttributeContext } from '@/providers/user-attributes-provider';
import  { useContext } from 'react';

// Define the context

// Custom hook to use the context
export const useUserAttribute = () => useContext(UserAttributeContext);
