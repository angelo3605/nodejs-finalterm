import { BrowserRouter, Route, Routes } from "react-router";
import { Refine } from "@refinedev/core";
import routerProvider from "@refinedev/react-router";

import { dataProvider } from "./providers/data-provider";
import { RootLayout } from "./layouts/root-layout";

import { ListProducts } from "./pages/products/list";
import { Dashboard } from "./pages/dashboard";
import { Home, Package } from "lucide-react";
import { ShowProduct } from "./pages/products/show";
import { authProvider } from "./providers/auth-provider";
import { LoginPage } from "./pages/auth/login";

const resources = [
  {
    name: "dashboard",
    list: "/",
    meta: {
      section: "Overview",
      label: "Dashboard",
      icon: <Home className="size-4" />,
    },
  },
  {
    name: "products",
    list: "/products",
    show: "/products/:id/show",
    meta: {
      section: "Catalogue",
      label: "Products",
      icon: <Package className="size-4" />,
    },
  },
];

export function App() {
  return (
    <BrowserRouter>
      <Refine resources={resources} routerProvider={routerProvider} authProvider={authProvider} dataProvider={dataProvider}>
        <Routes>
          <Route element={<RootLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products">
              <Route index element={<ListProducts />} />
              <Route path=":id">
                <Route path="show" element={<ShowProduct />} />
              </Route>
            </Route>
          </Route>
          <Route path="login" element={<LoginPage />} />
        </Routes>
      </Refine>
    </BrowserRouter>
  );
}
