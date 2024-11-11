import { createHashRouter,useLocation, Navigate  } from "react-router-dom";
import Page404 from "../pages/Page404";
import Root from "./Root";
import Home from "../pages/Home";
import VaccinationCertificate from "../pages/VaccinationCertificate";
import VaccinationSchedule from "../pages/VaccinationSchedule";
import Login from "../pages/Login";
import Registration from "../pages/Registration";
import UnauthorizedLayout from "../layouts/UnauthorizedLayout";
import FAQs from "../pages/FAQs";
import ResetPassword from "../pages/ResetPassword";
import SetNewPassword from "../pages/SetNewPassword";
import { useSelector } from "react-redux";

const AuthRoute = ({ element }) => {
  const { user } = useSelector((state) => state.clientInfo);

  const authRoutes = ["/user-auth", "/forgot-password", "/reset-password", "/set-password", "/registration"];

  const location = useLocation();

  return user?.access_token && authRoutes.includes(location.pathname) ? <Navigate to={"/"} /> : element;
};

const router = createHashRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Page404 />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "vaccination-schedule",
        element: <VaccinationSchedule />,
      },
      {
        path: "vaccination-certificate",
        element: <VaccinationCertificate />,
      },
      {
        path: "faqs",
        element: <FAQs />,
      },
    ],
  },
  {
    path: "/user-auth",
    element: <UnauthorizedLayout />,
    errorElement: <Page404 />,
    children: [
      {
        path: "",
        element: <AuthRoute element={<Login />} />,
      },
      {
        path: "registration",
        element: <AuthRoute element={<Registration />} />,
      },
      {
        path: "reset-password",
        element: <AuthRoute element={<ResetPassword />} />,
      },
      {
        path: "set-password",
        element: <AuthRoute element={<SetNewPassword />} />,
      },
    ],
  },
]);

export default router;
