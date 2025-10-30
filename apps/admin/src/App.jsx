import { ThemeProvider } from "@/components/refine-ui/theme/theme-provider";
import "@fontsource/dancing-script/700.css";
import "@fontsource-variable/ibm-plex-sans";
import { Authenticated, Refine } from "@refinedev/core";
import routerProvider, {
  CatchAllNavigate,
  NavigateToResource,
} from "@refinedev/react-router";
import {
  Blocks,
  CircleUserRound,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Sparkles,
  TicketPercent,
} from "lucide-react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
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
import { EditVariant } from "./pages/variants/edit";
import { ListCategories } from "./pages/categories/list";
import { CreateCategory } from "./pages/categories/create";
import { EditCategory } from "./pages/categories/edit";
import { ListOrders } from "./pages/orders/list";
import { ListBrands } from "./pages/brands/list";
import { CreateBrand } from "./pages/brands/create";
import { EditBrand } from "./pages/brands/edit";
import { ListDiscountCodes } from "./pages/discount-codes/list";
import { CreateDiscountCode } from "./pages/discount-codes/create";
import { EditDiscountCode } from "./pages/discount-codes/edit";
import { ListUsers } from "./pages/users/list";

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
    create: "/discount-codes/create",
    edit: "/discount-codes/edit/:code",
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
    list: "/products",
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
    edit: "/categories/edit/:slug",
    meta: {
      section: "Catalogue",
      label: "Categories",
      icon: <Blocks />,
    },
  },
  {
    name: "brands",
    list: "/brands",
    create: "/brands/create",
    edit: "/brands/edit/:slug",
    meta: {
      section: "Catalogue",
      label: "Brands",
      icon: <Sparkles />,
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
            <Route path="orders">
              <Route index element={<ListOrders />} />
            </Route>
            <Route path="discount-codes">
              <Route index element={<ListDiscountCodes />} />
              <Route path="create" element={<CreateDiscountCode />} />
              <Route path="edit/:code" element={<EditDiscountCode />} />
            </Route>
            <Route path="products">
              <Route index element={<ListProducts />} />
              <Route path="create" element={<CreateProduct />} />
              <Route path="show/:slug" element={<ShowProduct />} />
              <Route path="edit/:slug" element={<EditProduct />} />
              <Route path=":slug/variants">
                <Route
                  index
                  element={<NavigateToResource resource="products" />}
                />
                <Route path="create" element={<CreateVariant />} />
                <Route path="edit/:id" element={<EditVariant />} />
              </Route>
            </Route>
            <Route path="categories">
              <Route index element={<ListCategories />} />
              <Route path="create" element={<CreateCategory />} />
              <Route path="edit/:slug" element={<EditCategory />} />
            </Route>
            <Route path="brands">
              <Route index element={<ListBrands />} />
              <Route path="create" element={<CreateBrand />} />
              <Route path="edit/:slug" element={<EditBrand />} />
            </Route>
            <Route path="users">
              <Route index element={<ListUsers />} />
            </Route>
          </Route>
          <Route path="login" element={<LoginPage />} />
        </Routes>
      </Refine>
      <Toaster />
    </BrowserRouter>
  );
}
