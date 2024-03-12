import React from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import { AuthProvider } from "./contextProvider/AuthContext";
import MyRoutes from "./routes/AppRouter";

const App: React.FC = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <MyRoutes />
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
