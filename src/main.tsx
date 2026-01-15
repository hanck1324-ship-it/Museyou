
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import RootApp from "./RootApp";
import { ThemeProvider } from "./components/common/ThemeProvider";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RootApp />
    </ThemeProvider>
  </BrowserRouter>
);
  