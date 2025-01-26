import { createBrowserRouter } from "react-router-dom";
import { LoginPage } from "../pages/Login/LoginPage";
import { RootLayout } from "../components/RootLayout";
import { ProfilePage } from "../pages/Profile/ProfilePage";
import { OpenedMailPage } from "../pages/Mail/OpenedMailPage";
import { ContentBlock } from "../components/ContentBlock";
import { MailPage } from "../pages/Mail/MailPage";

export type Props = {
  children: React.ReactNode;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: `/opened-mail/:id`,
        element: (
          <ContentBlock>
            <OpenedMailPage />
          </ContentBlock>
        ),
      },
      {
        path: `/mail`,
        element: (
          <ContentBlock>
            <MailPage />
          </ContentBlock>
        ),
      },
    ],
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
