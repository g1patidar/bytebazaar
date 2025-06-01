import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProjectDetails from "./pages/projects/ProjectDetails";
import ProjectsByCategory from "./pages/projects/ProjectsByCategory";
import Cart from "./pages/checkout/Cart";
import Checkout from "./pages/checkout/Checkout";
import PaymentSuccess from "./pages/checkout/PaymentSuccess";
import PaymentFailed from "./pages/checkout/PaymentFailed";
import Dashboard from "./pages/user/Dashboard";
import PurchaseHistory from "./pages/user/PurchaseHistory";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminSettings from "./pages/admin/AdminSettings";
import Layout from "./components/layout/Layout";
import AdminLayout from "./components/layout/AdminLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";
import AuthInitializer from "./components/auth/AuthInitializer";
import * as React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import {AddProjectForm} from "./components/adminComponent/AddNewProject";
import { EditProject } from "./components/adminComponent/EditProject";

const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthInitializer />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Index />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="projects/category/:categoryId" element={<ProjectsByCategory />} />
                <Route path="projects/:projectId" element={<ProjectDetails />} />

                {/* Protected User Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="cart" element={<Cart />} />
                  <Route path="checkout" element={<Checkout />} />
                  <Route path="payment/success" element={<PaymentSuccess />} />
                  <Route path="payment/failed" element={<PaymentFailed />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="purchases" element={<PurchaseHistory />} />
                </Route>
              </Route>

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route element={<AdminRoute />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="projects" element={<AdminProjects />} />
                  <Route path="projects/edit/:projectId" element={<EditProject />} />,
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>
              </Route>

              {/* Catch-all Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);

export default App;
