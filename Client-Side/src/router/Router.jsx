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
        path:'/user-profile',
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
    

      

    ]
  },
 
  {
    path:'/signup',
    element:<SignUp/>
  },
  {
    path:'/checkout',
    element:<RequireAuth>
      <CheckoutPage/>
    </RequireAuth>
  }
]);


export default router;