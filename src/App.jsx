import AppRoutes from "./routes/AppRoutes";
import { SignInProvider } from "./contexts/SignInContext";

function App() {
  return (
    <SignInProvider>
      <AppRoutes />
    </SignInProvider>
  );
}

export default App;