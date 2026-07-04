import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const navItems = [
  { to: "/", label: "Home", icon: "🏠" },
  { to: "/vitals", label: "Vitals", icon: "📈" },
  { to: "/medications", label: "Meds", icon: "💊" },
  { to: "/water", label: "Water", icon: "💧" },
  { to: "/wellness", label: "Mind", icon: "🧠" },
  { to: "/plans", label: "Plans", icon: "🥗" },
  { to: "/menstrual", label: "Cycle", icon: "🌸" },
  { to: "/emergency", label: "SOS", icon: "🚨" },
];

const AppShell = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-sage flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 bg-white border-r border-black/5 p-6">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-9 h-9 rounded-full bg-teal flex items-center justify-center text-white text-lg">♥</div>
          <span className="font-display text-xl font-semibold text-ink">Arogya Care</span>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? "bg-teal-light text-teal" : "text-ink/60 hover:bg-sage"
                }`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="pt-4 border-t border-black/5">
          <p className="text-sm font-semibold text-ink truncate">{user?.name}</p>
          <button onClick={handleLogout} className="text-xs text-coral font-medium mt-1 hover:underline">
            Log out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="md:hidden flex items-center justify-between px-5 py-4 bg-white border-b border-black/5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-teal flex items-center justify-center text-white text-sm">♥</div>
            <span className="font-display font-semibold text-ink">Arogya Care</span>
          </div>
          <button onClick={handleLogout} className="text-xs text-coral font-medium">
            Log out
          </button>
        </header>

        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 max-w-4xl w-full mx-auto">{children}</main>

        {/* Mobile bottom nav */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-black/5 flex justify-around py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default AppShell;
