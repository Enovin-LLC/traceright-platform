import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import Admin from "@/pages/Admin";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import DashboardLayout from "./components/DashboardLayout";
import { ThemeProvider } from "./contexts/ThemeContext";
import Dashboard from "./pages/Dashboard";
import Materials from "./pages/Materials";
import Batches from "./pages/Batches";
import Recipes from "./pages/Recipes";
import Orders from "./pages/Orders";
import Logistics from "./pages/Logistics";
import WarehousePage from "./pages/Warehouse";
import Suppliers from "./pages/Suppliers";
import Analytics from "./pages/Analytics";
import AIInsights from "./pages/AIInsights";
import Settings from "./pages/Settings";

function Router() {
  return (
    <DashboardLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/materials" component={Materials} />
        <Route path="/batches" component={Batches} />
        <Route path="/recipes" component={Recipes} />
        <Route path="/orders" component={Orders} />
        <Route path="/logistics" component={Logistics} />
        <Route path="/warehouse" component={WarehousePage} />
        <Route path="/suppliers" component={Suppliers} />
        <Route path="/analytics" component={Analytics} />
        <Route path="/ai-insights" component={AIInsights} />
        <Route path="/settings" component={Settings} />
        <Route path="/admin" component={Admin} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </DashboardLayout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
