import { fetchAuthSession } from 'aws-amplify/auth';
import { Schema } from '../../amplify/data/resource';
import { generateClient } from 'aws-amplify/data';

// generate your data client using the Schema from your backend
const { idToken } = (await fetchAuthSession({forceRefresh: true})).tokens ?? {};
export default generateClient<Schema>({
    authToken: idToken?.toString()
});