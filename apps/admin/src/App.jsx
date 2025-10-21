import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import { Refine, Authenticated } from "@refinedev/core";
import routerProvider, { CatchAllNavigate } from "@refinedev/react-router";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";

import { dataProvider } from "./providers/data-provider";
import { RootLayout } from "./layouts/root-layout";

import { ListProducts } from "./pages/products/list";
import { Dashboard } from "./pages/dashboard";
import { Blocks, CircleUserRound, LayoutDashboard, Package, ShoppingBag, TicketPercent } from "lucide-react";
import { ShowProduct } from "./pages/products/show";
import { authProvider } from "./providers/auth-provider";
import { LoginPage } from "./pages/auth/login";
import { Toaster } from "./components/refine-ui/notification/toaster";

import "@fontsource/poppins";
import "@fontsource/dancing-script/700.css";
import { EditProduct } from "./pages/products/edit";

const resources = [
  {
    name: "dashboard",
    list: "/",
    meta: {
      section: "Main",
      label: "Dashboard",
      icon: <LayoutDashboard className="size-4" />,
    },
  },
  {
    name: "orders",
    list: "/orders",
    meta: {
      section: "Sales & Discounts",
      label: "Orders",
      icon: <ShoppingBag />,
    },
  },
  {
    name: "discount-codes",
    list: "/discount-codes",
    meta: {
      section: "Sales & Discounts",
      label: "Discount codes",
      icon: <TicketPercent />,
    },
  },
  {
    name: "products",
    list: "/products",
    create: "/products/create",
    show: "/products/:id/show",
    edit: "/products/:id/edit",
    meta: {
      section: "Catalogue",
      label: "Products",
      icon: <Package />,
    },
  },
  {
    name: "categories",
    list: "/categories",
    create: "/categories/create",
    show: "/categories/:id/show",
    meta: {
      section: "Catalogue",
      label: "Categories",
      icon: <Blocks />,
    },
  },
  {
    name: "users",
    list: "/users",
    meta: {
      section: "Administration",
      label: "Users",
      icon: <CircleUserRound />,
    },
  },
];

export function App() {
  return (
    <BrowserRouter>
      <Refine resources={resources} routerProvider={routerProvider} authProvider={authProvider} dataProvider={dataProvider} notificationProvider={useNotificationProvider}>
        <Routes>
          <Route
            element={
              <Authenticated fallback={<CatchAllNavigate to="/login" />}>
                <RootLayout>
                  <Outlet />
                </RootLayout>
              </Authenticated>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="products">
              <Route index element={<ListProducts />} />
              <Route path=":id">
                <Route path="show" element={<ShowProduct />} />
                <Route path="edit" element={<EditProduct />} />
              </Route>
            </Route>
          </Route>
          <Route element={<Authenticated fallback={<Outlet />} />}>
            <Route path="login" element={<LoginPage />} />
          </Route>
        </Routes>
      </Refine>
      <Toaster />
    </BrowserRouter>
  );
}
