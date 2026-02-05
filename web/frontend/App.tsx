import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { useAppBridge } from "@shopify/app-bridge-react";
import AppInitializer from "./AppInitializer";
import { Edit, Create, Home, Plans } from "./pages";
import "./App.css";

import * as Sentry from "@sentry/react";

import { PolarisProvider, QueryProvider } from "./components";
import { ErrorPage } from "libautech-frontend";
import { PolarisVizProvider } from "@shopify/polaris-viz";
import useShopInfoStore from "./stores/useShopInfoStore";
import { getUnifiedNavTabs } from "./helpers/navConfig";
import { UnifiedNavigation } from "./components/common/UnifiedNavigation";

// Layout component to wrap common elements
function Layout() {
  const { isPaid, firstOfferCreated } = useShopInfoStore();

  return (
    <>
      <main style={{ minHeight: "100vh" }}>
        <main
          style={{
            margin: "0rem 2rem",
            padding: "1rem 0",
            paddingBottom: "80px",
          }}
        >
          <UnifiedNavigation
            tabs={getUnifiedNavTabs({
              isPaid,
            })}
            showNavMenu={firstOfferCreated}
          />
          <QueryProvider>
            <Outlet />
          </QueryProvider>
        </main>
      </main>
    </>
  );
}

// Create router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "dashboard",
        element: <Home />,
      },
      {
        path: "plans",
        element: <Plans />,
      },
      {
        path: "create",
        element: <Create />,
      },
      {
        path: "edit/:id",
        element: <Edit />,
      },
      {
        path: "exitiframe",
        element: <div></div>,
      },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

export default function App() {
  const shopify = useAppBridge();
  Sentry.setTag("shop", shopify.config.shop);
  Sentry.setUser({ id: shopify.config.shop });

  return (
    <PolarisVizProvider>
      <PolarisProvider>
        <AppInitializer>
          <RouterProvider router={router} />
        </AppInitializer>
      </PolarisProvider>
    </PolarisVizProvider>
  );
}
