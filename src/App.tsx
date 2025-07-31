import React, { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import { routes } from "./routes/Routes";
import PageLoader from "./components/GlobalComponents/PageLoader";
// import PerformanceMonitor from "./components/PerformanceMonitor";

const App: React.FC = () => {
  const routing = useRoutes(routes);
  return (
    <>
      <Suspense
        fallback={
          <PageLoader
            type="spinner"
            message="Loading Food Ordering Admin..."
          />
        }
      >
        {routing}
      </Suspense>
      {/* <PerformanceMonitor /> */}
    </>
  );
};

export default App;
