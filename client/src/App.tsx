import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Desktop from "./components/Desktop";
import { AppStateProvider } from "./hooks/use-app-state";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppStateProvider>
        <Desktop />
        <Toaster />
      </AppStateProvider>
    </QueryClientProvider>
  );
}

export default App;
