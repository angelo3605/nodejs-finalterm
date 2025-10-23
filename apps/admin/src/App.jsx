import { ThemeProvider } from "@/components/refine-ui/theme/theme-provider";
import "@fontsource/dancing-script/700.css";
import "@fontsource/poppins";
import { Authenticated, Refine } from "@refinedev/core";
import routerProvider, { CatchAllNavigate } from "@refinedev/react-router";
import {
  Blocks,
  CircleUserRound,
  LayoutDashboard,
  Package,
  ShoppingBag,
  TicketPercent,
} from "lucide-react";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { RootLayout } from "./layouts/root-layout";
import { LoginPage } from "./pages/auth/login";
import { Dashboard } from "./pages/dashboard";
import { CreateProduct } from "./pages/products/create";
import { EditProduct } from "./pages/products/edit";
import { ListProducts } from "./pages/products/list";
import { ShowProduct } from "./pages/products/show";
import { CreateVariant } from "./pages/variants/create";
import { authProvider } from "./providers/auth-provider";
import { dataProvider } from "./providers/data-provider";

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
    show: "/products/show/:slug",
    edit: "/products/edit/:slug",
    meta: {
      section: "Catalogue",
      label: "Products",
      icon: <Package />,
    },
  },
  {
    name: "variants",
    create: "/products/:slug/variants/create",
    show: "/products/:slug/variants/show/:id",
    edit: "/products/:slug/variants/edit/:id",
    meta: {
      hide: true,
      label: "Variants",
    },
  },
  {
    name: "categories",
    list: "/categories",
    create: "/categories/create",
    show: "/categories/show/:id",
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
      <Refine
        resources={resources}
        routerProvider={routerProvider}
        authProvider={authProvider}
        dataProvider={dataProvider}
        notificationProvider={useNotificationProvider}
      >
        <Routes>
          <Route
            element={
              <Authenticated fallback={<CatchAllNavigate to="/login" />}>
                <ThemeProvider
                  defaultTheme="system"
                  storageKey="mint-boutique-theme"
                >
                  <RootLayout>
                    <Outlet />
                  </RootLayout>
                </ThemeProvider>
              </Authenticated>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="products">
              <Route index element={<ListProducts />} />
              <Route path="create" element={<CreateProduct />} />
              <Route path="show/:slug" element={<ShowProduct />} />
              <Route path="edit/:slug" element={<EditProduct />} />
            </Route>
            <Route path="variants">
              <Route index element={<Navigate to="/products" replace />} />
              <Route path="create" element={<CreateVariant />} />
            </Route>
          </Route>
          <Route path="login" element={<LoginPage />} />
        </Routes>
      </Refine>
      <Toaster />
    </BrowserRouter>
  );
}
