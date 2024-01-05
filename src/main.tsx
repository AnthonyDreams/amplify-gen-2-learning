import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/index.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { withAuthenticator } from "@aws-amplify/ui-react";
import config from "../amplifyconfiguration.json";
import { Amplify } from "aws-amplify";
Amplify.configure(config);
const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")!).render(
  withAuthenticator(() => (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  ))({})
);
