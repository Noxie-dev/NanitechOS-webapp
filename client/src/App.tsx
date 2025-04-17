import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Desktop from "./components/Desktop";
import { AppStateProvider } from "./hooks/use-app-state";
import MobileDetector from "./components/MobileDetector";
import { Route, Switch } from "wouter";
import Shutdown from "./pages/shutdown";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppStateProvider>
        {/* Mobile detector overlay for very small screens */}
        <MobileDetector />
        
        <Switch>
          <Route path="/shutdown" component={Shutdown} />
          <Route path="/" component={Desktop} />
        </Switch>
        
        <Toaster />
      </AppStateProvider>
    </QueryClientProvider>
  );
}

export default App;
