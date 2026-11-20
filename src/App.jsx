import AppRoutes from "./routes/AppRoutes";
import { SignInProvider } from "./contexts/SignInContext";
import { EnquiryProvider } from "./contexts/EnquiryContext";

function App() {
  return (
    <SignInProvider>
      <EnquiryProvider>
        <AppRoutes />
      </EnquiryProvider>
    </SignInProvider>
  );
}

export default App;