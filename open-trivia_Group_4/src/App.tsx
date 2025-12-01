import { useState, useEffect, useMemo, createContext, useContext } from 'react';
import type { FC } from 'react';
import { Home, Star, Zap, Clock, ChevronLeft, Check, X, Loader2, Award, Menu } from 'lucide-react';
import axios from 'axios';

// --- CONTEXT & HOOKS (Internal Sidebar Provider) ---

// Custom hook to manage sidebar state (since we can't use an external context provider)
const useInternalSidebar = (): { isCollapsed: boolean; toggleCollapse: () => void; isMobile: boolean } => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    
    // Track small-screen state (md breakpoint equivalent: 768px)
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

    // Initialize state based on screen size on mount and update on resize
    useEffect(() => {
      // Start collapsed on mobile, open on desktop
      setIsCollapsed(window.innerWidth < 768);

      const onResize = () => setIsMobile(window.innerWidth < 768);
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }, []);

    const toggleCollapse = () => setIsCollapsed(prev => !prev);

    // Provide the necessary state and toggler
    return { isCollapsed, toggleCollapse, isMobile };
};


// --- LOCAL STORAGE CONSTANTS ---
const FAVORITES_KEY = 'triviaFavorites';
const SCORE_HISTORY_KEY = 'triviaScoreHistory'; // New constant for score history

// --- UTILITY FUNCTIONS ---

// Decode HTML entities (OpenTDB sends them sometimes)
const decodeHtml = (html: string | null | undefined): string => {
  if (!html) return '';
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

// Small UI building blocks used throughout the file (kept simple)
const Button: FC<any> = (props: any) => {
  const { children, onClick, className = "", variant = "primary", disabled = false, ...rest } = props;
  const baseStyles = "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed";
  let variantStyles = "";
  switch (variant) {
    case 'outline': variantStyles = "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"; break;
    case 'secondary': variantStyles = "bg-gray-200 text-gray-800 hover:bg-gray-300"; break;
    case 'danger': variantStyles = "bg-red-600 text-white hover:bg-red-700"; break;
    case 'ghost': variantStyles = "hover:bg-gray-700 text-gray-300"; break;
    case 'primary':
    default: variantStyles = "bg-indigo-600 text-white hover:bg-indigo-700"; break;
  }

  return (
    <button onClick={onClick} className={`${baseStyles} ${variantStyles} ${className}`} disabled={disabled} {...rest}>
      {children}
    </button>
  );
};

const Card: FC<any> = ({ children, className = "" }: any) => (
  <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>{children}</div>
);

const Separator: FC<any> = ({ className = "" }: any) => (
  <div className={`h-px w-full bg-gray-200 ${className}`} />
);


// --- SIDEBAR STRUCTURE COMPONENTS ---

const Sidebar: FC<any> = ({ isCollapsed, children }: any) => (
  // h-screen and flex flex-col ensure the sidebar fills the viewport height
  <div
    className={`bg-gray-900 text-white transition-all duration-300 h-screen z-40 flex flex-col
      ${isCollapsed ? 'w-16' : 'w-64'} 
      fixed md:relative top-0 left-0 
      flex-shrink-0
    `}
  >
    {children}
  </div>
);

const SidebarHeader: FC<any> = ({ isCollapsed, children }: any) => {
  // useContext here but guard against null (provider ensures it exists in App tree)
  const ctx = useContext(SidebarContext) as { toggleCollapse?: () => void } | null;
  const toggle = ctx?.toggleCollapse ?? (() => {});

  return (
    <div className={`p-2 flex justify-end items-center h-16 transition-all duration-300`}>
      {/* Content (Title/Logo) is only visible when not collapsed */}
      <div className={`flex-1 overflow-hidden px-2 transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
        {children}
      </div>
      {/* Collapse Toggle Button - Always Visible */}
      <Button 
        variant="ghost" 
        onClick={toggle} 
        className="p-2 mr-1"
      >
        <ChevronLeft className={`w-6 h-6 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : 'rotate-0'} text-gray-400`} />
      </Button>
    </div>
  );
};

const SidebarContent: FC<any> = ({ children }: any) => (
  // flex-1 ensures this content area takes up all remaining space. 
  // Changed p-2 to pt-2 px-2 pb-0 to ensure no padding remains at the bottom of the sidebar.
  <div className="flex-1 overflow-y-auto pt-2 px-2 pb-0 space-y-4">
    {children}
  </div>
);

// New SidebarFooter component definition
const SidebarFooter: FC<any> = ({ isCollapsed, currentMode, currentDifficulty, ModeIcon }: any) => {
  const modeText = currentMode === 'time_attack' ? 'Time Attack' : 'Classic';
  const difficultyText = currentDifficulty ? `, ${currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1)}` : '';

  return (
    <div className={`p-4 mt-auto border-t border-gray-700 transition-all duration-300 ${isCollapsed ? 'p-2' : 'p-4'}`}>
      <div className={`text-sm text-gray-400 space-y-1 transition-opacity duration-300 ${isCollapsed ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 h-auto'}`}>
        <p className="text-xs">WMAD-302 Group 4</p>
        <p className="text-xs">© 2025</p>
      </div>
      <div className={`flex items-center text-xs text-indigo-400 mt-2 ${isCollapsed ? 'justify-center' : ''}`}>
        {/* Dynamically render the ModeIcon */}
        <ModeIcon className={`w-4 h-4 flex-shrink-0 ${isCollapsed ? '' : 'mr-2'}`} />
        <span className={`transition-opacity duration-300 ${isCollapsed ? 'sr-only' : 'opacity-100'}`}>
          Mode: {modeText}{difficultyText}
        </span>
      </div>
    </div>
  );
};


const SidebarGroup: FC<any> = ({ children }: any) => <div className="space-y-1">{children}</div>;

const SidebarGroupLabel: FC<any> = ({ isCollapsed, children }: any) => (
    <div className={`text-xs font-semibold uppercase text-gray-400 px-4 py-2 transition-all duration-300 ${isCollapsed ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 h-auto'}`}>
        {children}
    </div>
);

const SidebarMenuButton: FC<any> = ({ Icon, label, onClick, active, isCollapsed }: any) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-3 py-2 rounded-lg transition-colors duration-150 ${
        active ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-800'
      } ${isCollapsed ? 'justify-center' : 'justify-start'}`}
      title={isCollapsed ? label : undefined}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className={`ml-3 whitespace-nowrap transition-opacity duration-300 ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 w-auto'}`}>
        {label}
      </span>
    </button>
  );
};

// ApplicationSidebarGroup: Added Scoreboard
const ApplicationSidebarGroup: FC<any> = ({ view, setView, isCollapsed }: any) => {
  const applicationItems = [
    { title: "Home", icon: Home, view: 'dashboard' },
    { title: "Favorites", icon: Star, view: 'favorites' },
    { title: "Scoreboard", icon: Award, view: 'scoreboard' }, // NEW
  ];
  return (
    <SidebarGroup>
      <SidebarGroupLabel isCollapsed={isCollapsed}>Application</SidebarGroupLabel>
      <div className="space-y-1">
        {applicationItems.map((item) => (
          <SidebarMenuButton 
            key={item.title}
            onClick={() => setView(item.view)}
            active={view === item.view}
            Icon={item.icon}
            label={item.title}
            isCollapsed={isCollapsed}
          />
        ))}
      </div>
    </SidebarGroup>
  );
};

// Context for Sidebar state access within the application tree
const SidebarContext = createContext<{ isCollapsed: boolean; toggleCollapse: () => void } | null>(null);


// --- VIEW COMPONENTS (Dashboard, Quiz, Favorites) ---

const DashboardView: FC<any> = ({ startQuiz, preferences, setPreferences, categories, isLoadingCategories }: any) => {
  const difficulties = [
    { label: "Easy", value: "easy" },
    { label: "Medium", value: "medium" },
    { label: "Hard", value: "hard" },
    { label: "Mix", value: null },
  ];

  const modes = [
    { label: "Classic (Score)", value: "classic", icon: Clock },
    { label: "Time Attack (Speed)", value: "time_attack", icon: Zap },
  ];
  
  return (
    <div className="max-w-4xl w-full space-y-2">
      <h1 className="text-3xl font-extrabold text-gray-900">Start a New Quiz!</h1>
      <p className="text-gray-600">Configure your challenge preferences below.</p>

      <div className="space-y-6">

        <div className="max-w-3xl space-y-3">
            {/* 1. Game Mode Selection */}
            <Card>
                <h2 className="text-xl font-semibold mb-2">1. Choose Game Mode</h2>
                <div className="grid grid-cols-2 gap-4">
                {modes.map((mode: any) => (
                    <Button
                    key={mode.value}
                    variant={preferences.mode === mode.value ? 'primary' : 'outline'}
                    className="py-2 h-auto flex-col"
                    onClick={() => setPreferences((prev: any) => ({ ...prev, mode: mode.value }))}
                    >
                    <mode.icon className="w-6 h-6 mb-2" />
                    <span>{mode.label}</span>
                    </Button>
                ))}
                </div>
            </Card>

            {/* 2. Difficulty Selection */}
            <Card>
                <h2 className="text-xl font-semibold mb-2">2. Select Difficulty</h2>
                <div className="grid grid-cols-4 gap-3">
                {difficulties.map((d: any) => (
                    <Button
                    key={d.value || 'mix'}
                    variant={preferences.difficulty === d.value ? 'primary' : 'secondary'}
                    onClick={() => setPreferences((prev: any) => ({ ...prev, difficulty: d.value }))}
                    className="py-3"
                    >
                    {d.label}
                    </Button>
                ))}
                </div>
            </Card>
        </div> {/* End Modes and Difficulty Wrapper */}

        {/* 2. Parameters Card*/}
        <div className="max-w-3xl space-y-3">
             {/* 3. Questions Count & Category Selection */}
            <Card>
                <h2 className="text-xl font-semibold mb-2">3. Set Parameters</h2>
                <div className="max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Question Count */}
                    <div className="space-y-2">
                        <label htmlFor="count" className="block text-sm font-medium text-gray-700">Number of Questions (max 50)</label>
                        <input
                        id="count"
                        type="number"
                        min="1"
                        max="50"
                        value={preferences.count}
                        onChange={(e: any) => setPreferences((prev: any) => ({ ...prev, count: Math.max(1, Math.min(50, Number(e.target.value))) }))}
                        className="w-full rounded-lg border-gray-300 shadow-sm p-2 text-lg focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                    
                    {/* Category */}
                    <div className="space-y-2">
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                        <select
                        id="category"
                        value={preferences.category}
                        onChange={(e: any) => setPreferences((prev: any) => ({ ...prev, category: e.target.value }))}
                        className="w-full rounded-lg border-gray-300 shadow-sm p-2 text-lg focus:border-indigo-500 focus:ring-indigo-500 bg-white"
                        disabled={isLoadingCategories}
                        >
                        <option value="0">Any Category</option>
                        {isLoadingCategories ? (
                            <option disabled>Loading categories...</option>
                        ) : (
                          categories.map((cat: any) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                          ))
                        )}
                        </select>
                    </div>
                </div>
            </Card>
        </div> {/* End Parameters Wrapper */}

      </div> {/* End Main Content Stack */}

      {/* Start Button */}
      <div className="pt-2 flex justify-center">
        <Button
          onClick={startQuiz}
          className="w-full md:w-auto px-12 py-4 text-xl font-bold"
        >
          {preferences.mode === 'time_attack' ? 'Start Time Attack' : 'Start Classic Quiz'}
        </Button>
      </div>
      
    </div> 
  );
};


const QuizView: FC<any> = ({ preferences, questions, setView, saveFavorite, favoriteQuestions, saveScore }: any) => { 
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(preferences.mode === 'time_attack' ? 60 : 0);
  const [timerActive, setTimerActive] = useState(preferences.mode === 'time_attack');
  const [results, setResults] = useState<{ category: string; isCorrect: boolean }[]>([]);
  const [hasSavedScore, setHasSavedScore] = useState(false); // NEW state for race condition fix

  const currentQuestion = questions[currentQuestionIndex];
  
  // Custom Hook for Timer
  useEffect(() => {
    if (preferences.mode !== 'time_attack' || !timerActive || showResult || hasSavedScore) return; // Added hasSavedScore check

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimerActive(false);
          
          if (!hasSavedScore) { // Race condition fix: Only save if not already saved
              saveScore({
                score, // Current score is correct (current Q is unanswered/0 pts)
                total: questions.length,
                mode: preferences.mode,
                difficulty: preferences.difficulty,
              });
              setHasSavedScore(true);
          }
          setShowResult(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive, preferences.mode, showResult, hasSavedScore, questions.length, score, preferences.difficulty, saveScore]); 

  const allAnswers = useMemo(() => {
    if (!currentQuestion) return [];
    const incorrect = currentQuestion.incorrect_answers.map(decodeHtml);
    const correct = decodeHtml(currentQuestion.correct_answer);
    
    const answers = [...incorrect, correct];
    
    // Simple Shuffle function
    for (let i = answers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [answers[i], answers[j]] = [answers[j], answers[i]];
    }
    return answers;
  }, [currentQuestion]);
  
  const isFavorite = (question: any) => {
    const questionText = decodeHtml(question.question);
    const questionId = btoa(questionText).replace(/=/g, '').substring(0, 20);
    return favoriteQuestions.some((fav: any) => fav.id === questionId);
  };
  
  const handleAnswerClick = (answer: any) => {
    if (isChecking || hasSavedScore) return; // Prevent interaction if checking or score is saved
    
    setSelectedAnswer(answer);
    setIsChecking(true);
    setTimerActive(false);

    const isCorrect = answer === decodeHtml(currentQuestion.correct_answer);
    
    // Use functional update to ensure score is calculated correctly for the last question
    let newScore: number | undefined;
    setScore((s: number) => {
        newScore = s + (isCorrect ? 1 : 0);
        return newScore;
    });
    
    const categoryName = decodeHtml(currentQuestion.category);
    setResults((prev: any) => [...prev, { category: categoryName, isCorrect }]);

    setTimeout(() => {
      const isLastQuestion = currentQuestionIndex === questions.length - 1;
      
      if (isLastQuestion) {
        // We MUST use the newScore variable calculated above for the save, 
        // as the state update might not have completed yet.
        const finalScore = newScore; 

        if (!hasSavedScore) { // Race condition fix: Only save if not already saved
            saveScore({
              score: finalScore,
              total: questions.length,
              mode: preferences.mode,
              difficulty: preferences.difficulty,
            });
            setHasSavedScore(true);
        }
        setShowResult(true);
        setTimerActive(false);

      } else {
        setCurrentQuestionIndex((prev: number) => prev + 1);
        setSelectedAnswer(null);
        setIsChecking(false);
        if (preferences.mode === 'time_attack') setTimerActive(true); 
      }
    }, 1500);
  };

  const getAnswerClass = (answer: any) => {
    if (selectedAnswer === null) return "hover:bg-indigo-50";

    const isCurrentAnswer = answer === selectedAnswer;
    const isCorrectAnswer = answer === decodeHtml(currentQuestion.correct_answer);

    if (!isChecking) return "hover:bg-indigo-50";

    if (isCorrectAnswer) {
      return "bg-green-100 border-green-500 text-green-800 ring-4 ring-green-200";
    }
    
    if (isCurrentAnswer && !isCorrectAnswer) {
      return "bg-red-100 border-red-500 text-red-800 ring-4 ring-red-200";
    }
    
    return "bg-gray-100 text-gray-500 opacity-60";
  };
  
  const categoryStats = useMemo(() => {
    if (!showResult) return {};
    // Calculate stats based on the accumulated results array
    return results.reduce((acc: any, result: any) => {
        const cat = result.category;
        acc[cat] = acc[cat] || { total: 0, correct: 0 };
        acc[cat].total++;
        if (result.isCorrect) {
            acc[cat].correct++;
        }
        return acc;
    }, {});
  }, [results, showResult]);

  // When the quiz finishes we will show the result in a modal overlay

  // Loading/No Question State
  if (!currentQuestion) {
    return (
      <div className="text-left p-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <p className="mt-4 text-gray-600">Fetching questions...</p>
      </div>
    );
  }

  // Main Quiz View — render quiz content and conditionally render the results modal
  return (
    <>
    {/* Removed redundant padding classes (p-4 md:p-8) */}
    <div className="max-w-3xl w-full space-y-6">
      <div className="flex justify-between items-center text-gray-700 font-semibold mb-6">
        <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
        <span>Score: {score}</span>
      </div>
      
      {/* Time Attack Timer */}
      {preferences.mode === 'time_attack' && (
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full bg-red-500 transition-all duration-1000`}
            style={{ width: `${(timeRemaining / 60) * 100}%` }}
          />
        </div>
      )}

      <Card className="shadow-2xl">
        <div className="flex justify-between items-start mb-4">
          <span className="text-sm font-medium uppercase text-indigo-600">
            {decodeHtml(currentQuestion.category)}
          </span>
          <Button
            variant="secondary"
            className="p-1 h-auto"
            onClick={() => saveFavorite(currentQuestion)}
            title={isFavorite(currentQuestion) ? 'Remove from Favorites' : 'Add to Favorites'}
          >
            <Star className={`w-5 h-5 transition-colors ${isFavorite(currentQuestion) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
          </Button>
        </div>
        
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {decodeHtml(currentQuestion.question)}
        </h2>
        
        <div className="space-y-3">
          {allAnswers.map((answer: any) => (
            <Button
              key={answer}
              variant="outline"
              className={`w-full text-left py-3 h-auto justify-start border-2 ${getAnswerClass(answer)}`}
              onClick={() => handleAnswerClick(answer)}
              disabled={isChecking}
            >
              <span className="flex-1">{answer}</span>
              {isChecking && answer === decodeHtml(currentQuestion.correct_answer) && (
                <Check className="w-5 h-5 text-green-600 ml-2" />
              )}
              {isChecking && answer === selectedAnswer && answer !== decodeHtml(currentQuestion.correct_answer) && (
                <X className="w-5 h-5 text-red-600 ml-2" />
              )}
            </Button>
          ))}
        </div>
      </Card>
    </div>

    {showResult && (
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-black/60" onClick={() => setShowResult(false)} />
        <Card className="relative z-10 max-w-3xl w-full p-8">
          <div className="text-center space-y-6">
            <Award className="w-16 h-16 text-yellow-500 mx-auto" />
            <h1 className="text-3xl font-bold text-gray-900">Quiz Complete!</h1>
            <p className="text-lg text-gray-600">You answered {results.filter((r: any) => r.isCorrect).length} out of {questions.length} questions correctly.</p>
            <div className="text-5xl font-extrabold text-indigo-600">{questions.length > 0 ? Math.round((results.filter((r: any) => r.isCorrect).length / questions.length) * 100) : 0}%</div>
            {preferences.mode === 'time_attack' && timeRemaining > 0 && (
              <p className="text-md font-medium text-gray-700">Time remaining: {timeRemaining} seconds</p>
            )}

            <Separator />

            <h2 className="text-2xl font-semibold mt-6 mb-4 text-left">Category Performance</h2>
            <div className="space-y-3 text-left">
              {Object.entries(categoryStats).map(([category, stats]: any) => (
                <div key={category} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border">
                  <span className="font-medium text-gray-700 truncate">{category}</span>
                  <div className="flex items-center space-x-2">
                    <span className={`font-bold ${stats.correct > stats.total / 2 ? 'text-green-600' : 'text-red-600'}`}>{stats.correct} / {stats.total}</span>
                    <span className="text-sm text-gray-500">({stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0}%)</span>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            <div className="flex justify-end space-x-4 mt-4">
              <Button variant="ghost" onClick={() => setShowResult(false)}>Close</Button>
              <Button onClick={() => setView('dashboard')}>
                <ChevronLeft className="w-4 h-4 mr-2" /> Start New Quiz
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )}
    </>
  );
  // NOTE: When showResult is true the modal is rendered from the parent scope (see below)
};

// --- NEW VIEW COMPONENT ---
const ScoreboardView: FC<any> = ({ scoreHistory }: any) => {
    if (scoreHistory.length === 0) {
        return (
            <div className="max-w-3xl w-full">
                <Card className="text-center space-y-4">
                    <Award className="w-12 h-12 text-indigo-500" />
                    <h1 className="text-2xl font-bold">Scoreboard is Empty</h1>
                    <p className="text-gray-600">
                        Play a few quizzes to see your history recorded here!
                    </p>
                    <Button onClick={() => window.location.reload()}>
                      Start a Quiz
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-3xl w-full space-y-6">
            <h1 className="text-4xl font-extrabold text-gray-900 flex items-center">
                <Award className="w-8 h-8 mr-3 text-indigo-500 fill-indigo-500" />
                Quiz History ({scoreHistory.length} Records)
            </h1>

            <Card className="p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mode</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">%</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {scoreHistory.map((score: any, index: number) => {
                                const percentage = score.total > 0 ? Math.round((score.score / score.total) * 100) : 0;
                                const date = new Date(score.timestamp).toLocaleDateString('en-US', { 
                                    year: '2-digit', month: 'numeric', day: 'numeric', 
                                    hour: '2-digit', minute: '2-digit' 
                                });
                                return (
                                    <tr key={score.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">{score.score} / {score.total}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{score.mode.replace('_', ' ')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{score.difficulty || 'Mix'}</td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${percentage >= 70 ? 'text-green-600' : percentage >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>{percentage}%</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};


const FavoritesView: FC<any> = ({ favoriteQuestions, saveFavorite, isLoadingFavorites }: any) => {
  if (isLoadingFavorites) {
    return (
      <div className="text-left p-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <p className="mt-4 text-gray-600">Loading your favorites...</p>
      </div>
    );
  }

  if (favoriteQuestions.length === 0) {
    return (
      // Content is centered and limited to max-w-3xl, removed redundant padding
      <div className="max-w-3xl w-full">
        <Card className="text-center space-y-4">
          <Star className="w-12 h-12 text-yellow-500" />
          <h1 className="text-2xl font-bold">No Favorites Yet</h1>
          <p className="text-gray-600">
            Add questions to your favorites list from the quiz screen to see them here.
          </p>
        </Card>
      </div>
    );
  }

  return (
    // Content is centered and limited to max-w-3xl, removed redundant padding
    <div className="max-w-3xl w-full space-y-6">
      <h1 className="text-4xl font-extrabold text-gray-900 flex items-center">
        <Star className="w-8 h-8 mr-3 text-yellow-500 fill-yellow-500" />
        Your Favorite Trivia Questions ({favoriteQuestions.length})
      </h1>

      <div className="space-y-4">
        {favoriteQuestions.map((fav: any, index: number) => (
          <Card key={fav.id || index} className="border-l-4 border-yellow-500">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-medium uppercase text-indigo-600">{decodeHtml(fav.category)}</span>
                <p className="text-lg font-semibold text-gray-800 mt-1">{decodeHtml(fav.question)}</p>
                <div className="mt-2 text-sm text-gray-600">
                    <p>Correct Answer: <span className="font-bold text-green-700">{decodeHtml(fav.correct_answer)}</span></p>
                    <p>Difficulty: <span className="capitalize">{decodeHtml(fav.difficulty)}</span></p>
                </div>
              </div>
              <Button
                variant="danger"
                className="p-2 h-auto ml-4"
                onClick={() => saveFavorite(fav)} 
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};


// --- MAIN APP COMPONENT ---

function App() {
  const { isCollapsed, toggleCollapse, isMobile } = useInternalSidebar();
  const [view, setView] = useState('dashboard');

  const [categories, setCategories] = useState<any[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  
  const [currentQuestions, setCurrentQuestions] = useState<any[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  
  const [favoriteQuestions, setFavoriteQuestions] = useState<any[]>([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);
  
  const [scoreHistory, setScoreHistory] = useState<any[]>([]); 

  const [preferences, setPreferences] = useState<any>({
    count: 10,
    mode: 'classic', 
    difficulty: null, 
    category: '0', 
  });

  // Determine the active icon for the footer
  const CurrentModeIcon = preferences.mode === 'time_attack' ? Zap : Clock;

  // 1. FETCH CATEGORIES from OpenTDB API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://opentdb.com/api_category.php');
        if (response.status === 200 && response.data.trivia_categories) {
          setCategories(response.data.trivia_categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);
  
  // 2. LOCAL STORAGE: Load Favorites and Score History on Mount
  useEffect(() => {
    try {
      // Load Favorites
      const storedFavorites = localStorage.getItem(FAVORITES_KEY);
      if (storedFavorites) {
        setFavoriteQuestions(JSON.parse(storedFavorites));
      }
      
      // Load Score History
      const storedScores = localStorage.getItem(SCORE_HISTORY_KEY);
      if (storedScores) {
        setScoreHistory(JSON.parse(storedScores));
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
    } finally {
      setIsLoadingFavorites(false);
    }
  }, []);

  
  // 3. LOCAL STORAGE: Save/Remove Favorite Logic
  const saveFavorite = (question: any) => {
    const questionText = decodeHtml(question.question); 
    const questionId = btoa(questionText).replace(/=/g, '').substring(0, 20); 

    const cleanQuestion = {
        id: questionId, 
        question: question.question,
        correct_answer: question.correct_answer,
        category: question.category,
        difficulty: question.difficulty,
    };
    
    let currentFavorites = [...favoriteQuestions];
    const existingIndex = currentFavorites.findIndex(fav => fav.id === questionId);

    try {
      if (existingIndex !== -1) {
        currentFavorites.splice(existingIndex, 1);
      } else {
        currentFavorites.push(cleanQuestion);
      }
      
      setFavoriteQuestions(currentFavorites);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(currentFavorites));
      
    } catch (error) {
      console.error("Error toggling favorite status in localStorage:", error);
    }
  };
  
  // 4. Score History Save Function
  const saveScore = (scoreData: any) => {
    const newScore = {
      ...scoreData,
      id: Date.now() + Math.random(), // Add random to ensure unique ID even if timestamps are close
      timestamp: new Date().toISOString(),
    };

    setScoreHistory(prev => {
      const updatedHistory = [newScore, ...prev].slice(0, 50); // Keep max 50 entries
      try {
        localStorage.setItem(SCORE_HISTORY_KEY, JSON.stringify(updatedHistory));
      } catch (error) {
        console.error("Error saving score history to localStorage:", error);
      }
      return updatedHistory;
    });
  };


  // 5. MAIN QUIZ LOGIC: Fetch Questions and Start Quiz
  const startQuiz = async () => {
    setIsLoadingQuestions(true);
    setCurrentQuestions([]);

    const { count, difficulty, category } = preferences;
    const endpoint = `https://opentdb.com/api.php?amount=${count}&type=multiple`;
    
    const categoryParam = category !== '0' ? `&category=${category}` : '';
    const difficultyParam = difficulty ? `&difficulty=${difficulty}` : '';
    
    const requestUrl = `${endpoint}${categoryParam}${difficultyParam}`;

    try {
      const result = await axios.get(requestUrl);
      
      if (result.status === 200 && result.data.response_code === 0) {
        setCurrentQuestions(result.data.results);
        setView('quiz'); 
      } else if (result.data.response_code === 1) {
        // Using console.error instead of alert per instructions
        console.error("Not enough questions available for the selected criteria. Please try a different category or difficulty.");
        setView('dashboard');
      } else {
        console.error("Failed to fetch trivia questions. Check API status.");
        setView('dashboard');
      }
    } catch (error) {
      console.error("An unexpected error occurred while fetching questions:", error);
      setView('dashboard');
    } finally {
      setIsLoadingQuestions(false);
    }
  };


  // --- RENDERING LOGIC ---
  
  const renderContent = () => {
    if (isLoadingQuestions) {
        return (
            <div className="text-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                <p className="mt-4 text-gray-700 font-semibold">Loading {preferences.count} questions...</p>
            </div>
        );
    }
    
    switch (view) {
      case 'quiz':
        return (
          <QuizView 
            preferences={preferences}
            questions={currentQuestions}
            setView={setView}
            saveFavorite={saveFavorite}
            favoriteQuestions={favoriteQuestions}
            saveScore={saveScore} // Passed down saveScore
          />
        );
      case 'favorites':
        return (
          <FavoritesView 
            favoriteQuestions={favoriteQuestions}
            saveFavorite={saveFavorite}
            isLoadingFavorites={isLoadingFavorites}
          />
        );
      case 'scoreboard': // NEW case
        return (
          <ScoreboardView 
            scoreHistory={scoreHistory} 
          />
        );
      case 'dashboard':
      default:
        return (
          <DashboardView 
            startQuiz={startQuiz}
            setView={setView}
            preferences={preferences}
            setPreferences={setPreferences}
            categories={categories}
            isLoadingCategories={isLoadingCategories}
          />
        );
    }
  };
  
  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleCollapse }}>
      <div className="flex min-h-screen bg-gray-50 font-sans">
        
        {/* Sidebar Component: h-screen and flex-col ensures full height */}
        <Sidebar isCollapsed={isCollapsed}>
          <SidebarHeader isCollapsed={isCollapsed}>
            <h1 className="scroll-m-20 text-center text-3xl font-extrabold tracking-tight text-balance">
              <span className="text-indigo-400">Open</span><span className="text-white">Trivia</span>
            </h1>
            <p className="text-right text-muted-foreground text-xl">
              For every <em>Juan</em>
            </p>
          </SidebarHeader>
          <SidebarContent>
            <ApplicationSidebarGroup view={view} setView={setView} isCollapsed={isCollapsed} />
          </SidebarContent>
          <SidebarFooter 
            isCollapsed={isCollapsed} 
            currentMode={preferences.mode}
            currentDifficulty={preferences.difficulty}
            ModeIcon={CurrentModeIcon}
          />
        </Sidebar>
        
        {/* Main Content Area - Dynamic Margin and Padding adjustment */}
        <main 
          className={`flex-1 overflow-y-auto transition-all duration-300 min-h-screen p-0`}
        >
          {/* Mobile Menu Trigger */}
          <div className="md:hidden flex justify-end mb-4 p-4">
              <Button onClick={toggleCollapse} variant="secondary" className="p-2">
                  <Menu className="w-6 h-6" />
              </Button>
          </div>
          {/* Consolidated padding into this wrapper to ensure content is fully within the scrolling area */}
          <div className="max-w-6xl mx-auto p-4 md:p-8 pt-4 pb-12">
            {renderContent()}
          </div>
        </main>

        {/* Mobile Overlay */}
        {isMobile && !isCollapsed && (
            <div 
                className="fixed inset-0 bg-black opacity-50 z-30 md:hidden" 
                onClick={toggleCollapse}
            />
        )}
        
      </div>
    </SidebarContext.Provider>
  );
}

export default App;