import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AppProvider } from '@/data/mock';
import { AppShell } from '@/components/shell';
import { Welcome, Chat, Crisis, Tracker, Person } from '@/pages/student';
import { Coordinator, OnCall, Overview, StaffCase, StaffInbox } from '@/pages/portal';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

function Router() {
  return <AppShell><RoutedErrorBoundary><Switch>
    <Route path="/" component={Welcome} />
    <Route path="/chat" component={Chat} />
    <Route path="/crisis" component={Crisis} />
    <Route path="/track/:caseId" component={Tracker} />
    <Route path="/person" component={Person} />
    <Route path="/staff" component={StaffInbox} />
    <Route path="/staff/case/:id" component={StaffCase} />
    <Route path="/coordinator" component={Coordinator} />
    <Route path="/oncall" component={OnCall} />
    <Route path="/overview" component={Overview} />
    <Route component={NotFound} />
  </Switch></RoutedErrorBoundary></AppShell>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><AppProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter></AppProvider><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;