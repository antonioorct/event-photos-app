import { AppRoutes } from "@/app/routes";
import { AppProvider } from "@/app/provider";
import "@/app/App.css";

function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}

export default App;
