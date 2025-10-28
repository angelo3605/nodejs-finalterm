import { BrowserRouter, Routes, Route, Outlet } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Login from "./pages/Login";
import { Catalog } from "./pages/Catalog";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="login" element={<Login />} />
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
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
