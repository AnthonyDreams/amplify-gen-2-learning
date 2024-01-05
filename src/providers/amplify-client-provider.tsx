import { V6Client } from '@aws-amplify/api-graphql';
import { Schema } from '../../amplify/data/resource';
import { ReactNode, createContext, useEffect, useState } from 'react';
import { useUserAttribute } from '@/hooks/useUserAttribute';
import { fetchAuthSession } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/data';

export const AmplifyClientContext = createContext<{
    client: V6Client<Schema> | null;
}>({
    client: null,
});


export const AmplifyClientProvider = ({ children }: { children: ReactNode }) => {
    const { attributes: userAttributes } = useUserAttribute()
    const [client, setClient] = useState<V6Client<Schema> | null>(null)

    async function handleTokenRefresh() {
        const { idToken } = (await fetchAuthSession({ forceRefresh: true })).tokens ?? {};
        if(!idToken){
            return null
        }
        const client = generateClient<Schema>({
            authToken: idToken.toString()
        })

        setClient(
            client
        )
    }

    useEffect(() => {
        handleTokenRefresh()
    }, [
        userAttributes
    ])

    const contextValue = {
        client: client
    }

    return (
        <AmplifyClientContext.Provider value={contextValue}>
            {children}
        </AmplifyClientContext.Provider>
    )
}