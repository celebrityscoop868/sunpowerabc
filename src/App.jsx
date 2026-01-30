// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";

import Progress from "./pages/Progress.jsx";
import Notifications from "./pages/Notifications.jsx";
import Help from "./pages/Help.jsx";
import Team from "./pages/Team.jsx";

// existentes en repo actual
import ShiftOverview from "./pages/ShiftOverview.jsx";
import ShiftSelect from "./pages/ShiftSelect.jsx";

// ✅ cuando las traigas del repo viejo (o las crees)
import Feed from "./pages/Feed.jsx";
import ShiftsOverview from "./pages/ShiftsOverview.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/progress" replace />} />

        <Route path="/progress" element={<Progress />} />

        {/* ✅ feed (viejo) */}
        <Route path="/feed" element={<Feed />} />

        {/* ✅ shifts overview (viejo) */}
        <Route path="/shifts" element={<ShiftsOverview />} />

        {/* rutas actuales */}
        <Route path="/shift" element={<ShiftOverview />} />
        <Route path="/shift/select" element={<ShiftSelect />} />

        <Route path="/notifications" element={<Notifications />} />
        <Route path="/help" element={<Help />} />
        <Route path="/team" element={<Team />} />
      </Route>

      <Route path="*" element={<Navigate to="/progress" replace />} />
    </Routes>
  );
}
