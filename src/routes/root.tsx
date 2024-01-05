import "@aws-amplify/ui-react/styles.css";
import { Outlet } from "react-router-dom";
import ModernSideBar from "../components/common/modern-sidebar";
import { UserAttributeProvider } from "@/providers/user-attributes-provider";
import { AmplifyClientProvider } from "@/providers/amplify-client-provider";
import { Toaster } from "@/components/ui/toaster";
import { signOut } from "aws-amplify/auth";

export default function Root() {

  return (
    <UserAttributeProvider>
      <AmplifyClientProvider>
        <ModernSideBar onSignOut={signOut}>
          <Outlet />
        </ModernSideBar>
        <Toaster />
      </AmplifyClientProvider>
    </UserAttributeProvider>
  );
}