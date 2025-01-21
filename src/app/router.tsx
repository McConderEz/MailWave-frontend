import { createBrowserRouter } from "react-router-dom";
import { LoginPage } from "../pages/Login/LoginPage";
import { RootLayout } from "../components/RootLayout";
import { ProfilePage } from "../pages/Profile/ProfilePage";

export type Props = {
  children: React.ReactNode;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [{}],
    errorElement: <div>Упс</div>,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
    children: [{}],
  },
]);
