import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import LoadingSpinner from "../components/LoadingSpinner";
import ProtectedRoute from "../components/ProtectedRoute";

// ============================================================
// 🎯 LAZY LOADED PAGES — Code splitting
// ============================================================
const Home = lazy(() => import("../pages/home/Home"));
const AcServicing = lazy(() => import("../pages/Shop/AcServicing"));
const AcCooling = lazy(() => import("../pages/Shop/AcCooling"));
const AcInstallation = lazy(() => import("../pages/Shop/AcInstallation"));
const SignUp = lazy(() => import("../components/SignUp"));
const UserProfile = lazy(() => import("../pages/UserProfile/UserProfile"));
const UpdateProfile = lazy(() => import("../pages/UpdateProfile/UpdateProfile"));
const ForgotPassword = lazy(() => import("../components/ForgotPassword"));
const CheckoutPage = lazy(() => import("../pages/CheckoutPage/CheckoutPage"));
const OrdersPage = lazy(() => import("../pages/Order/OrdersPage"));
const Dashboard = lazy(() => import("../admin/Dashboard"));
const OrdersList = lazy(() => import("../admin/OrdersList"));
const UsersList = lazy(() => import("../admin/UsersList"));
const VendorsPage = lazy(() => import("../admin/VendorsPage"));
const AdminAddService = lazy(() => import("../admin/AdminAddService"));
const RefrigeratorCategory = lazy(() => import("../pages/Shop/RefrigeratorCategory"));
const WashingMachine = lazy(() => import("../components/WashingMachine"));
const ResetPassword = lazy(() => import("../components/ResetPassword"));
const MasterServicesPage = lazy(() => import("../admin/MasterServicesPage"));

// ✅ NEW: Admin Settings
const AdminSettings = lazy(() => import("../admin/AdminSettings"));

// ============================================================
// 🎯 WRAPPER — Suspense সহ lazy components
// ============================================================
const withSuspense = (Component) => (
  <Suspense fallback={<LoadingSpinner />}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      { path: "/", element: withSuspense(Home) },
      { path: "/ac-servicing", element: withSuspense(AcServicing) },
      { path: "/ac-cooling-problem", element: withSuspense(AcCooling) },
      { path: "/ac-installation", element: withSuspense(AcInstallation) },
      { path: "/refrigerator-service", element: withSuspense(RefrigeratorCategory) },
      { path: "/washing-machine-service", element: withSuspense(WashingMachine) },
      { path: "/profile", element: withSuspense(UserProfile) },
      { path: "/update-profile", element: withSuspense(UpdateProfile) },
      { path: "/forgot-password", element: withSuspense(ForgotPassword) },
      { path: "/reset-password", element: withSuspense(ResetPassword) },
      { path: "/orders", element: withSuspense(OrdersPage) },
      { path: "/signup", element: withSuspense(SignUp) },
      { path: "/checkout", element: withSuspense(CheckoutPage) },
    ],
  },
  {
    path: "/admin/dashboard",
    element: (
      <ProtectedRoute role="admin">
        {withSuspense(Dashboard)}
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/orders",
    element: (
      <ProtectedRoute role={["admin", "superadmin"]}>
        {withSuspense(OrdersList)}
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/users",
    element: (
      <ProtectedRoute role={["admin", "superadmin"]}>
        {withSuspense(UsersList)}
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/vendors",
    element: (
      <ProtectedRoute role={["admin", "superadmin"]}>
        {withSuspense(VendorsPage)}
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/Services",
    element: (
      <ProtectedRoute role={["admin", "superadmin"]}>
        {withSuspense(AdminAddService)}
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/master-services",
    element: withSuspense(MasterServicesPage),
  },
  
  // ✅ NEW: Admin Settings Route
  {
    path: "/admin/settings",
    element: (
      <ProtectedRoute role={["admin", "superadmin"]}>
        {withSuspense(AdminSettings)}
      </ProtectedRoute>
    ),
  },
]);

export default router;