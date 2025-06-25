import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<div>Home Content</div>} />
        <Route path="dashboard" element={<div>Dashbaord</div>} />
        <Route path="market-news" element={<div>Marked news</div>} />
        <Route
          path="market-news/overview"
          element={<div>Overview Content</div>}
        />
        <Route
          path="market-news/forecasts"
          element={<div>Forecasts Content</div>}
        />
        <Route
          path="market-news/outlook"
          element={<div>Outlook Content</div>}
        />
        <Route path="realtime" element={<div>Realtime</div>} />
        <Route path="releases" element={<div>Releases Content</div>} />
        <Route path="analytics" element={<div>Analytics Content</div>} />
        <Route path="contracts" element={<div>Contracts Content</div>} />
        <Route path="settings" element={<div>Settings Content</div>} />
        <Route path="security" element={<div>Security Content</div>} />
      </Route>
    </Routes>
  );
};

export default App;
