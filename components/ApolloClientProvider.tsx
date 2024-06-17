"use client";

import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
} from "@apollo/client";
import { useRef } from "react";

const client = new ApolloClient({
  uri: "/api/graphql",
  cache: new InMemoryCache(),
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
