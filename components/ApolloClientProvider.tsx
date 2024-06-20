"use client";

import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  DefaultOptions,
} from "@apollo/client";
import { useRef } from "react";


const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
};

const client = new ApolloClient({
  uri: "/api/graphql",
  cache: new InMemoryCache(),
  defaultOptions: defaultOptions,
});

const ApolloClientProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const clientRef = useRef(client);

  return (
    <ApolloProvider client={clientRef.current}>{children}</ApolloProvider>
  );
};

export default ApolloClientProvider;
