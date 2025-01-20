import { Outlet } from "react-router-dom";
import Header from "../app/App";
import { ContentBlock } from "./ContentBlock";

export function RootLayout() {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <main className="flex flex-col h-full px-2 sm:px-8 py-2 sm:py-5 mt-16 ml-60">
        <div className="flex-1 flex">
          <ContentBlock>
            <Outlet />
          </ContentBlock>
        </div>
      </main>
    </div>
  );
}
