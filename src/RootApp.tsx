import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import App from "./App";
import { BoardsRouter } from "./boards/BoardsRouter";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { setupNetworkMonitor } from "./lib/utils/errorHandler";
import AuthCallbackPage from "./auth/callback/page";
import { OrderList } from "./components/payment/OrderList";

export default function RootApp() {
  useEffect(() => {
    // 네트워크 상태 모니터링 설정
    setupNetworkMonitor();
  }, []);

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/orders" element={<OrderList />} />
        <Route path="/boards/*" element={<BoardsRouter />} />
        <Route path="/*" element={<App />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}


