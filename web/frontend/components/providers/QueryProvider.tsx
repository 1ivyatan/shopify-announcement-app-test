import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from "react-query";
import { ReactNode } from "react";

interface QueryProviderProps {
  children: ReactNode;
}

/**
 * Sets up the QueryClientProvider from react-query.
 * @desc See: https://react-query.tanstack.com/reference/QueryClientProvider#_top
 */
export function QueryProvider({ children }: QueryProviderProps): React.ReactElement {
  const client = new QueryClient({
    queryCache: new QueryCache(),
    mutationCache: new MutationCache(),
  });

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
