import { Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import { BoardsRouter } from "./boards/BoardsRouter";

export default function RootApp() {
  return (
    <Routes>
      <Route path="/boards/*" element={<BoardsRouter />} />
      <Route path="/*" element={<App />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}


