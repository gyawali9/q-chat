import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./AuthProvider";
import { ChatProvider } from "./ChatProvider";

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ChatProvider>{children}</ChatProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};
