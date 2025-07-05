import React, { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import { routes } from "./routes/Routes";
import { LoadingOverlay, Center } from "@mantine/core";

const App: React.FC = () => {
  const routing = useRoutes(routes);
  return (
    <Suspense
      fallback={
        <Center style={{ height: "100vh" }}>
          <LoadingOverlay visible={true} />
        </Center>
      }
    >
      {routing}
    </Suspense>
  );
};

export default App;
