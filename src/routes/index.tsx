import { createBrowserRouter } from "react-router-dom";
import RootLayout from './root';
import ErrorPage from "../error-page";
import Templates from "../pages/templates";
import Workspaces from "@/pages/workspace";
import DesignPage from "@/pages/design";
import TemplateDetailPage from "@/pages/templates/detail";
import DesignDetailPage from "@/pages/design/detail";
import RootBuilder from "./root-builder";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage/>,
    children: [
      {
        path: "templates/",
        element: <Templates/>,
      },
      {
        path: "workspace",
        element: <Workspaces/>
      },
      {
        path: "designs",
        element: <DesignPage/>,
      }
    ]
  },
  {
    path: "/",
    element: <RootBuilder />,
    errorElement: <ErrorPage/>,
    children: [
      {
        path: "templates/:id",
        element: <TemplateDetailPage/>
      },
      {
        path: "designs/:id",
        element: <DesignDetailPage/>
      }
    ]
  },
]);


export default router;