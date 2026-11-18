import { NavLink } from "react-router";

interface NavItem {
  label: string;
  to: string;
}

export function AppNav() {

  // List of nav items for this page
  const navItems: NavItem[] = [
    { label: "Groups", to: "/groups" }
  ];

  return (
    <nav
      aria-label="Main"
      className="order-last w-full md:order-0 md:w-auto md:flex-1"
    >
      <ul className="flex flex-wrap gap-x-5 gap-y-1">
        {navItems.map((item) => {
          return (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) => {
                  const base = "block border-b-2 py-1 text-sm font-medium";
                  return isActive
                    ? `${base} border-fg text-fg`
                    : `${base} border-transparent text-muted hover:text-fg`;
                }}
              >
                {item.label}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
