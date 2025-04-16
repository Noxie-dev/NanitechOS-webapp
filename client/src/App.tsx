import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Desktop from "./components/Desktop";
import { AppStateProvider } from "./hooks/use-app-state";
import MobileDetector from "./components/MobileDetector";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppStateProvider>
        {/* Mobile detector overlay for very small screens */}
        <MobileDetector />
        <Desktop />
        <Toaster />
      </AppStateProvider>
    </QueryClientProvider>
  );
}

export default App;
