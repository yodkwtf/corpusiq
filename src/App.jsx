import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PlannerProvider } from "./context/PlannerContext";
import Layout from "./components/shared/Layout";
import Landing from "./pages/Landing";
import InputFlow from "./pages/InputFlow";
import HowItWorks from "./pages/HowItWorks";
import NotFound from "./pages/NotFound";
import { SkeletonDashboard } from "./components/shared/Skeleton";

// Code-split the dashboard - it carries the charting library.
const Dashboard = lazy(() => import("./pages/Dashboard"));

export default function App() {
  return (
    <PlannerProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/plan" element={<InputFlow />} />
            <Route
              path="/dashboard"
              element={
                <Suspense fallback={<SkeletonDashboard />}>
                  <Dashboard />
                </Suspense>
              }
            />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </PlannerProvider>
  );
}
