import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Login from "./pages/Login";
import { Catalog } from "./pages/Catalog";
import Register from "./pages/Register";
import "@fontsource/dancing-script/700.css";
import "@fontsource-variable/ibm-plex-sans";
import Forgot from "./pages/Forgot";
import Reset from "./pages/Reset";
import NotFound from "./pages/NotFound";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import "swiper/css/effect-fade";
import "swiper/css/thumbs";
import "swiper/css/zoom";
import { Toaster } from "react-hot-toast";
import { ProfileLayout } from "@/layouts/ProfileLayout";
import { Info } from "@/pages/Info";
import { Addresses } from "@/pages/Addresses";
import { Password } from "@/pages/Password";
import { Cart } from "@/pages/Cart";
import { CheckoutResult } from "@/pages/CheckoutResult";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route
            element={
              <>
                <Outlet />
                <Toaster position="bottom-left" />
              </>
            }
          >
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot" element={<Forgot />} />
            <Route path="reset" element={<Reset />} />
            <Route
              element={
                <RootLayout>
                  <Outlet />
                </RootLayout>
              }
            >
              <Route index element={<Home />} />
              <Route path="cart" element={<Cart />} />
              <Route
                path="profile"
                element={
                  <ProfileLayout>
                    <Outlet />
                  </ProfileLayout>
                }
              >
                <Route index element={<Info />} />
                <Route path="addresses" element={<Addresses />} />
                <Route path="password" element={<Password />} />
                <Route path="*" element={<></>} />
              </Route>
              <Route path="all" element={<Catalog />} />
              <Route path="category/:slug" element={<Catalog />} />
              <Route path="product/:slug" element={<Product />} />
              <Route path="checkout/result" element={<CheckoutResult />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
