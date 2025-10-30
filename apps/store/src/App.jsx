import { BrowserRouter, Routes, Route, Outlet } from "react-router";
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

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
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
            <Route path="all" element={<Catalog />} />
            <Route path=":cat">
              <Route path=":id" element={<Product />} />
              <Route index path="*" element={<NotFound />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
