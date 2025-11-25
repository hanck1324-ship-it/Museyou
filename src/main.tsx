
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import RootApp from "./RootApp.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <RootApp />
  </BrowserRouter>
);
  