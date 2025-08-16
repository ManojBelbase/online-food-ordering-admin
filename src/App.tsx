import React, { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import { routes } from "./routes/Routes";
import PageLoader from "./components/GlobalComponents/PageLoader";
// import TokenStatus from "./components/Debug/TokenStatus";
import { useAutoTokenRefresh } from "./hooks/useTokenValidation";
// import PerformanceMonitor from "./components/PerformanceMonitor";
// import PerformanceMonitor from "./components/PerformanceMonitor";

const App: React.FC = () => {
  const routing = useRoutes(routes);

  // Enable automatic token refresh
  useAutoTokenRefresh(5); // Refresh token 5 minutes before expiry

  return (
    <>
      <Suspense
        fallback={
          <PageLoader
            type="spinner"
            message="Loading Food Ordering ..."
          />
        }
      >
        {routing}
      </Suspense>
      {/* <TokenStatus /> */}
      {/* <PerformanceMonitor /> */}
    </>
  );
};

export default App;
