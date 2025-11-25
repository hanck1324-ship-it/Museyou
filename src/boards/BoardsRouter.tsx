import { Routes, Route } from "react-router-dom";
import BoardListPage from "./pages/BoardListPage";
import BoardNewPage from "./pages/BoardNewPage";
import BoardDetailPage from "./pages/BoardDetailPage";

export function BoardsRouter() {
  return (
    <Routes>
      <Route index element={<BoardListPage />} />
      <Route path="new" element={<BoardNewPage />} />
      <Route path=":id" element={<BoardDetailPage />} />
    </Routes>
  );
}

