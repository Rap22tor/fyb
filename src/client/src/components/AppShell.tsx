import { Outlet } from "react-router";
import { AppHeader } from "./AppHeader";

// The wrapper around every signed-in page. Used as a layout route, so new pages just become children of it.
export function AppShell() {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 md:py-10">
        <Outlet />
      </main>
    </div>
  );
}
