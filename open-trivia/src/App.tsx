import { useEffect, useState } from "react";
import { Home, List, Settings, Star, Moon, Sun } from "lucide-react";
import "./App.css";
import { Separator } from "./components/ui/separator";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "./components/ui/sidebar";

import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import Favorites from "./pages/Favorites";
import QuizPage from "./pages/QuizPage";
import Preferences from "./pages/Preference"; 

const ApplicationSidebarGroup = () => {
  const menuItems = [
    { title: "Home", icon: Home, url: "/" },
    { title: "Categories", icon: List, url: "/categories" },
    { title: "Favorites", icon: Star, url: "/favorites" },
  ];

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Application</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton asChild>
                <Link
                  to={item.url}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent/20 transition-colors duration-200"
                >
                  <item.icon className="text-primary" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

const SettingsSidebarGroup = ({ theme, toggleTheme }: { theme: string, toggleTheme: () => void }) => {
  const menuItems = [
    { title: "Preferences", icon: Settings, url: "/preferences" }, 
  ];

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Settings</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton asChild>
                <Link
                  to={item.url}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent/20 transition-colors duration-200"
                >
                  <item.icon className="text-secondary" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent/20 transition-colors duration-200 w-full"
              >
                {theme === "dark" ? <Sun className="text-yellow-400" /> : <Moon className="text-blue-400" />}
                <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

function App() {
  const [theme, setTheme] = useState<string>(
    localStorage.getItem("otq_theme") || "light"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("otq_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <BrowserRouter>
      <SidebarProvider>
        <Sidebar className="transition-all duration-300">
          <SidebarHeader>
            <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
              Open Trivia
            </h1>
            <p className="text-muted-foreground text-xl">
              For every <em>Juan</em>
            </p>
            <Separator className="my-3" />
          </SidebarHeader>

          <SidebarContent>
            <ApplicationSidebarGroup />
            <SettingsSidebarGroup theme={theme} toggleTheme={toggleTheme} />
          </SidebarContent>

          <SidebarFooter>
            <p className="text-muted-foreground text-sm text-center">
              WMAD-302 Group 2<br />© 2025
            </p>
          </SidebarFooter>
        </Sidebar>

        <main className="p-6 w-full min-h-screen bg-background transition-colors duration-500">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/quiz/:id" element={<QuizPage />} />
            <Route path="/preferences" element={<Preferences />} />
          </Routes>
        </main>
      </SidebarProvider>
    </BrowserRouter>
  );
}

export default App;
