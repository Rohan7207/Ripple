import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing";
import Analysis from "./pages/Analysis";
import Overview from "./pages/Overview";
import Files from "./pages/Files";
import AskRipple from "./pages/AskRipple";
import Impact from "./pages/Impact";
import WhatIf from "./pages/WhatIf";

import Workspace from "./components/Workspace";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* Repository Analysis */}
        <Route path="/analysis" element={<Analysis />} />

        {/* Workspace */}
        <Route path="/workspace/:repositoryId" element={<Workspace />}>
          {/* Default workspace page */}
          <Route index element={<Navigate to="overview" replace />} />

          {/* Workspace Pages */}
          <Route path="overview" element={<Overview />} />

          <Route path="files" element={<Files />} />

          <Route path="ask" element={<AskRipple />} />

          <Route path="impact" element={<Impact />} />

          <Route path="what-if" element={<WhatIf />} />
        </Route>

        {/* Unknown URL */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
