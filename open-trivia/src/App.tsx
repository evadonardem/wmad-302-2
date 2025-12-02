import { Home, List, Settings, Star } from 'lucide-react';
import './App.css';
import { Separator } from './components/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger
} from './components/ui/sidebar';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Favorites from './pages/Favorites';
import Preferences from './pages/Preference';
import { useState, useEffect } from 'react';

// ---------------- Overview Card Component ----------------
const OverviewCard = ({
  title,
  description,
  buttonLabel,
  icon: Icon,
  proceedTo,
  bgColor,
  iconColor,
  buttonColor,
  buttonHover
}: {
  title: string;
  description: string;
  buttonLabel: string;
  icon: any;
  proceedTo: string;
  bgColor: string;
  iconColor: string;
  buttonColor: string;
  buttonHover: string;
}) => {
  const navigate = useNavigate();
  return (
    <div className={`rounded-lg shadow-lg p-8 flex flex-col items-center justify-between transition-transform duration-200 ${bgColor} hover:scale-105 h-full`}>
      <Icon className={`w-16 h-16 mb-6 ${iconColor} transition-transform duration-300 hover:scale-125`} />
      <div className="text-center flex-1 flex flex-col justify-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>
      </div>
      <button
        className={`px-6 py-3 text-white font-semibold rounded-lg transition-colors w-full max-w-xs ${buttonColor} ${buttonHover}`}
        onClick={() => navigate(proceedTo)}
      >
        {buttonLabel}
      </button>
    </div>
  );
};

// ---------------- Home Page (All Overviews) ----------------
const HomePage = () => {
  const overviewItems = [
    {
      title: "Quiz Overview",
      description: "Welcome to the quiz! Select your preferences and get started.",
      buttonLabel: "Start Quiz",
      icon: Home,
      proceedTo: "/Dashboard",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      buttonColor: "bg-blue-600",
      buttonHover: "hover:bg-blue-700"
    },
    {
      title: "Categories Overview",
      description: "Choose from multiple categories to customize your quiz experience.",
      buttonLabel: "Go to Categories",
      icon: List,
      proceedTo: "/categories",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      buttonColor: "bg-green-600",
      buttonHover: "hover:bg-green-700"
    },
    {
      title: "Favorites Overview",
      description: "See your saved favorite questions in one place.",
      buttonLabel: "Go to Favorites",
      icon: Star,
      proceedTo: "/favorites",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
      buttonColor: "bg-yellow-600",
      buttonHover: "hover:bg-yellow-700"
    },
    {
      title: "Preferences Overview",
      description: "Adjust quiz difficulty and question type before starting.",
      buttonLabel: "Set Preferences",
      icon: Settings,
      proceedTo: "/preferences",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      buttonColor: "bg-purple-600",
      buttonHover: "hover:bg-purple-700"
    },
  ];

  return (
    <div className="min-h-screen p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
      {overviewItems.map((item) => (
        <OverviewCard key={item.title} {...item} />
      ))}
    </div>
  );
};

// ---------------- Sidebar Groups ----------------
const SidebarGroupContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="sidebar-group-content">{children}</div>;
};

const ApplicationSidebarGroup = () => {
  const location = useLocation();
  
  const menuItems = [
    { title: "Home", icon: Home, url: '/' },
    { title: "Categories", icon: List, url: '/categories' },
    { title: "Favorites", icon: Star, url: '/favorites' },
  ];

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Application</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                <Link to={item.url} className="flex items-center gap-3 w-full">
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.title}</span>
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
  const location = useLocation();
  
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Settings</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={location.pathname === '/preferences'}>
              <Link to='/preferences' className="flex items-center gap-3 w-full">
                <Settings className="w-5 h-5" />
                <span className="font-medium">Preferences</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

// ---------------- Main App ----------------
function App() {
  const [difficulty, setDifficulty] = useState('');
  const [questionType, setQuestionType] = useState('multiple');

  useEffect(() => {
    const loadSavedPreferences = () => {
      try {
        const savedPrefs = localStorage.getItem('quizPreferences');
        if (savedPrefs) {
          const prefs = JSON.parse(savedPrefs);
          setDifficulty(prefs.difficulty || '');
          setQuestionType(prefs.questionType || 'multiple');
        }
      } catch (error) {
        console.error('Error loading saved preferences:', error);
      }
    };
    loadSavedPreferences();
  }, []);

  return (
    <BrowserRouter>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader className="px-6 py-4">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Open Trivia
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                For every <em>Juan</em>
              </p>
            </div>
            <Separator className="mt-4" />
          </SidebarHeader>
          <SidebarContent className="px-4">
            <ApplicationSidebarGroup />
            <SettingsSidebarGroup />
          </SidebarContent>
          <SidebarFooter className="px-6 py-4">
            <div className="text-center">
              <p className="text-gray-600 text-sm">
                WMAD-302 Group 1
              </p>
              <p className="text-gray-500 text-xs mt-1">
                &copy; 2025
              </p>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="relative">
          <div className="fixed top-6 right-6 z-50">
            <SidebarTrigger className="bg-white shadow-md border hover:bg-gray-50 transition-colors rounded-lg p-2" />
          </div>

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/Dashboard" element={<Dashboard difficulty={difficulty} questionType={questionType} />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/preferences" element={<Preferences difficulty={difficulty} setDifficulty={setDifficulty} questionType={questionType} setQuestionType={setQuestionType} />} />
          </Routes>
        </main>
      </SidebarProvider>
    </BrowserRouter>
  );
}

export default App;