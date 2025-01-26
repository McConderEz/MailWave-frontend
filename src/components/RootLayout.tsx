import { Outlet } from "react-router-dom";
import Header, { Navigation } from "../app/Navigation";
import { ContentBlock } from "./ContentBlock";
import { useState } from "react";
import { MailPage } from "../pages/Mail/MailPage";

export function RootLayout() {
  const [accessToken, setAccessToken] = useState("");

  return (
    <div className="h-screen flex flex-col">
      <Navigation />
      <main className="flex flex-col h-full px-2 sm:px-8 py-2 sm:py-5 mt-16 ml-60">
        <div className="flex-1 flex">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
