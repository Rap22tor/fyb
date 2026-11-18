import { AppNav } from "./AppNav";
import { UserArea } from "./UserArea";

export function AppHeader() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3">
        <span className="text-lg font-semibold">FYB</span> 
        <AppNav />
        <UserArea />
      </div>
    </header>
  );
}
