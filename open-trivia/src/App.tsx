import { Home, List, Settings, Star } from 'lucide-react';
import './App.css';
import { Separator } from './components/ui/separator';
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
  SidebarTrigger
} from './components/ui/sidebar';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Favorites from './pages/Favorites';
import Questions from "./pages/Questions";
import Preferences from "./pages/Preference";


// -------------------------- SIDEBAR GROUPS ----------------------------------

const ApplicationSidebarGroup = () => {
  const menuItems = [
    { title: "Home", icon: Home, url: "/" },
    { title: "Categories", icon: List, url: "/categories" },
    { title: "Favorites", icon: Star, url: "/favorites" }
  ];

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Application</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link to={item.url}>
                  <item.icon />
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

const SettingsSidebarGroup = () => {
  const menuItems = [{ title: "Preferences", icon: Settings, url: "/preferences" }];

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Settings</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link to={item.url}>
                  <item.icon />
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

// --------------------------- MAIN APP ---------------------------------------

function App() {
  const [triviaQuestions, setTriviaQuestions] = useState([]);
  const [isLoadingTriviaQuestions, setIsLoadingTriviaQuestions] = useState(true);

  // FIXED: Clean & safe API URL builder
  const fetchTriviaQuestions = async (
    numberOfQuestions = 10,
    type = "multiple",
    difficulty: string | null = null,
    category: number | null = null
  ) => {
    const params = new URLSearchParams({
      amount: numberOfQuestions.toString(),
      type
    });

    if (difficulty) params.append("difficulty", difficulty);
    if (category) params.append("category", category.toString());

    try {
      const result = await axios.get(`https://opentdb.com/api.php?${params.toString()}`);

      if (result.status === 200) {
        const { results } = result.data;
        setTriviaQuestions(results);
      }
    } catch (err) {
      console.error("Failed to fetch trivia questions:", err);
    }

    setIsLoadingTriviaQuestions(false);
  };


  // Fetch 50 questions on app load
  useEffect(() => {
    fetchTriviaQuestions(50);
  }, []);


  return (
    <BrowserRouter>
      <SidebarProvider>
        <Sidebar>q
          
          <SidebarHeader>
            <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight">
              Open Trivia
            </h1>
            <p className="text-muted-foreground text-xl">For every <em>Juan</em></p>
            <Separator />
          </SidebarHeader>

          <SidebarContent>
            <ApplicationSidebarGroup />
            <SettingsSidebarGroup />
          </SidebarContent>

          <SidebarFooter>
            <p className="text-muted-foreground text-sm">
              WMAD-302 Group ? <br />
              &copy; 2025
            </p>
          </SidebarFooter>
        </Sidebar>

        <main>
          <SidebarTrigger />

          {/* ROUTES */}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/questions" element={<Questions />} />
            <Route path="/preferences" element={<Preferences />} />

          </Routes>
        </main>
      </SidebarProvider>
    </BrowserRouter>
  );
}

export default App;
