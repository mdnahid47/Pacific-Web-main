import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Home from "../pages/home/Home";
import AcServicing from "../pages/Shop/AcServicing";
import AcCooling from "../pages/Shop/AcCooling";
import AcInstallation from "../pages/Shop/AcInstallation";
import SignUp from "../components/SignUp";
import UserProfile from "../pages/UserProfile/UserProfile";
import UpdateProfile from "../pages/UpdateProfile/UpdateProfile";
import ForgotPassword from "../components/ForgotPassword";
import CheckoutPage from "../pages/CheckoutPage/CheckoutPage";
import RequireAuth from "../contexts/RequireAuth ";
import OrdersPage from "../pages/Order/OrdersPage";
import Dashboard from "../admin/Dashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import OrdersList from "../admin/OrdersList";
import UsersList from "../admin/UsersList";
import VendorsPage from "../admin/VendorsPage";
import AdminAddService from "../admin/AdminAddService";
import RefrigeratorCategory from "../pages/Shop/RefrigeratorCategory";







const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/ac-servicing",
        element: <AcServicing />
      },
      {
        path: '/ac-cooling-problem',
        element: <AcCooling />
      },
      {
        path: '/ac-installation',
        element:<AcInstallation />
      },
      {
        path: '/refrigerator-category',
        element: <RefrigeratorCategory />
      },
      {
        path:'/profile',
        element:<UserProfile/>
      },
      {
        path:'/update-profile',
        element: <UpdateProfile/>
      },
      {
        path:'/forgot-password',
        element:<ForgotPassword/>
      },
    
      {
    path:'/orders',
    element:
      <OrdersPage/>
   
  },
   {
    path:'/signup',
    element:<SignUp/>
  },
  {
    path:'/checkout',
    element:
      <CheckoutPage/>
   
  }
      

    ]
  },
 
 {
  path: '/admin/dashboard',
  element: <ProtectedRoute role="admin"><Dashboard /></ProtectedRoute>,
 },
 {
  path: '/admin/orders',
  element: <ProtectedRoute role={["admin", "superadmin"]}><OrdersList /></ProtectedRoute>,
 },
 {
  path: '/admin/users',
  element: <ProtectedRoute role={["admin", "superadmin"]}><UsersList/></ProtectedRoute>,
 },
 {
  path: '/admin/vendors',
  element: <ProtectedRoute role={["admin", "superadmin"]}><VendorsPage/></ProtectedRoute>,
 },
 {
  path: '/admin/Services',
  element: <ProtectedRoute role={["admin", "superadmin"]}><AdminAddService/></ProtectedRoute>,
 }
   
]);


export default router;