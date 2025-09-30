import { BrowserRouter, Route, Routes } from "react-router";
import { Refine } from "@refinedev/core";
import routerProvider from "@refinedev/react-router";

import { dataProvider } from "./providers/data-provider";
import { RootLayout } from "./layouts/root-layout";

import { ListProducts } from "./pages/products/list";
import { Dashboard } from "./pages/dashboard";

const resources = [
  {
    name: "dashboard",
    list: "/",
    meta: { label: "Dashboard" },
  },
  {
    name: "products",
    list: "/products",
  },
];

export function App() {
  return (
    <BrowserRouter>
      <Refine routerProvider={routerProvider} dataProvider={dataProvider} resources={resources}>
        <Routes>
          <Route element={<RootLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products">
              <Route index element={<ListProducts />} />
            </Route>
          </Route>
        </Routes>
      </Refine>
    </BrowserRouter>
  );
}
