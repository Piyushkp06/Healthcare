import { Outlet } from "react-router-dom";
import { Toaster } from "../src/components/ui/toaster";

function App() {
  return (
    <div className="app">
      {/* Main content area where routes will be rendered */}
      <Outlet />

      {/* Toast notifications */}
      <Toaster />
    </div>
  );
}

export default App;
