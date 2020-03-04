import { ApolloClient, InMemoryCache, HttpLink } from 'apollo-boost';
import fetch from 'isomorphic-unfetch';

export type MyApolloClientCache = any;

let apolloClient: ApolloClient<MyApolloClientCache> | null = null;

function create(initialState?: MyApolloClientCache) {
    const isBrowser = typeof window !== 'undefined';
    const _uri = process.env.apiServer + "/graphql";

    return new ApolloClient({
        connectToDevTools: isBrowser,
        ssrMode: !isBrowser, // Disables forceFetch on the server (so queries are only run once)
        link: new HttpLink({
            uri: "https://bestblinds-api.herokuapp.com/graphql", // Server URL (must be absolute)
            credentials: 'include', // Additional fetch() options like `credentials` or `headers`
            // Use fetch() polyfill on the server
            fetch: !isBrowser ? fetch : undefined
        }),
        cache: new InMemoryCache().restore(initialState || {})
    });
}

export default function initApollo(initialState?: MyApolloClientCache) {
    // Make sure to create a new client for every server-side request so that data
    // isn't shared between connections (which would be bad)
    if (typeof window === 'undefined') {
        return create(initialState);
    }

    // Reuse client on the client-side
    if (!apolloClient) {
        apolloClient = create(initialState);
    }

    return apolloClient;
}