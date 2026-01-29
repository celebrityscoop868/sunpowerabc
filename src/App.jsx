import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";

import Progress from "./pages/Progress.jsx";
import Notifications from "./pages/Notifications.jsx";
import Help from "./pages/Help.jsx";
import Team from "./pages/Team.jsx";
import ShiftOverview from "./pages/ShiftOverview.jsx";
import ShiftSelect from "./pages/ShiftSelect.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/progress" replace />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/help" element={<Help />} />
        <Route path="/team" element={<Team />} />
        <Route path="/shift" element={<ShiftOverview />} />
        <Route path="/shift/select" element={<ShiftSelect />} />
      </Route>

      <Route path="*" element={<Navigate to="/progress" replace />} />
    </Routes>
  );
}
