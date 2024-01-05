import "@aws-amplify/ui-react/styles.css";
import { Outlet } from "react-router-dom";
import { UserAttributeProvider } from "@/providers/user-attributes-provider";
import { AmplifyClientProvider } from "@/providers/amplify-client-provider";
import '@/lib/builder.css'
import { Toaster } from "@/components/ui/toaster"


export default function RootBuilder() {
  return (
    <UserAttributeProvider>
      <AmplifyClientProvider>
        <Outlet />
        <Toaster />
      </AmplifyClientProvider>
    </UserAttributeProvider>
  );
}
