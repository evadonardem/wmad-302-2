import { Button } from '@/components/ui/button';
import { Trash2, Star, List, MessageSquare, Play } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';

interface FavoriteQuestion {
  id: string;
  question: string;
  category?: string;
  difficulty?: string;
  type?: string;
  correct_answer: string;
  answers: string[];
}

interface FavoriteCategory {
  id: string;
  name: string;
}

// Decode HTML entities in text
const decodeHTML = (html: string) => {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

export default function FavoritesPage() {
  const [favoriteQuestions, setFavoriteQuestions] = useState<FavoriteQuestion[]>([]);
  const [favoriteCategories, setFavoriteCategories] = useState<FavoriteCategory[]>([]);
  const [activeTab, setActiveTab] = useState<string>("questions");
  const navigate = useNavigate();

  // Load favorites from localStorage on component mount
  useEffect(() => {
    // Load favorite questions
    try {
      const questionsRaw = localStorage.getItem('favoriteQuestions');
      if (questionsRaw) {
        const questions = JSON.parse(questionsRaw);
        const questionsWithAnswers = questions.map((q: any) => ({
          ...q,
          answers: q.answers || [q.correct_answer]
        }));
        setFavoriteQuestions(questionsWithAnswers);
      }
    } catch {
      setFavoriteQuestions([]);
    }

    // Load favorite categories
    try {
      const categoriesRaw = localStorage.getItem('favoriteCategories');
      if (categoriesRaw) {
        setFavoriteCategories(JSON.parse(categoriesRaw));
      }
    } catch {
      setFavoriteCategories([]);
    }
  }, []);

  // Save favorite questions to localStorage
  const persistQuestions = (questions: FavoriteQuestion[]) => {
    try {
      localStorage.setItem('favoriteQuestions', JSON.stringify(questions));
    } catch {}
  };

  // Save favorite categories to localStorage
  const persistCategories = (categories: FavoriteCategory[]) => {
    try {
      localStorage.setItem('favoriteCategories', JSON.stringify(categories));
    } catch {}
  };

  // Remove question from favorites
  const removeFavoriteQuestion = (id: string) => {
    const next = favoriteQuestions.filter(f => f.id !== id);
    setFavoriteQuestions(next);
    persistQuestions(next);
  };

  // Remove category from favorites
  const removeFavoriteCategory = (id: string) => {
    const next = favoriteCategories.filter(f => f.id !== id);
    setFavoriteCategories(next);
    persistCategories(next);
  };

  // Use selected category for quiz
  const useCategory = (categoryId: string) => {
    localStorage.setItem("selectedCategory", JSON.stringify(categoryId));
    navigate("/Dashboard?refresh=" + Date.now());
  };

  // Clear all favorites in current tab
  const clearAllFavorites = () => {
    if (activeTab === "questions") {
      setFavoriteQuestions([]);
      persistQuestions([]);
    } else {
      setFavoriteCategories([]);
      persistCategories([]);
    }
  };

  // Get color for difficulty badge
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const totalFavorites = favoriteQuestions.length + favoriteCategories.length;

  // Empty state when no favorites
  if (totalFavorites === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <Card className="shadow-lg border-0">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold text-gray-900">Favorites</CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Your saved questions and categories will appear here
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="text-6xl mb-6">⭐</div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">No favorites yet</h3>
                <p className="text-gray-600 text-lg max-w-md mx-auto">
                  Start adding questions and categories to your favorites!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      <div className="w-full max-w-7xl">
        <Card className="shadow-lg border-0">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold text-gray-900">Favorites</CardTitle>
            <CardDescription className="text-lg text-gray-600">
              {totalFavorites} saved item{totalFavorites !== 1 ? 's' : ''} - Manage your favorite questions and categories
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Clear All button */}
            <div className="flex justify-end">
              <Button variant="outline" onClick={clearAllFavorites} className="border-gray-300">
                Clear All {activeTab === "questions" ? "Questions" : "Categories"}
              </Button>
            </div>

            {/* Tabs for Questions and Categories */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-gray-100 p-1 rounded-lg">
                <TabsTrigger 
                  value="questions" 
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  Questions ({favoriteQuestions.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="categories" 
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <List className="w-4 h-4" />
                  Categories ({favoriteCategories.length})
                </TabsTrigger>
              </TabsList>

              {/* Favorite Questions Tab */}
              <TabsContent value="questions" className="space-y-6">
                {favoriteQuestions.length === 0 ? (
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-12 text-center">
                      <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-3 text-gray-800">No favorite questions</h3>
                      <p className="text-gray-600 text-lg">
                        Add questions to favorites while taking quizzes!
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteQuestions.map((q) => (
                      <Card key={q.id} className="hover:shadow-lg transition-all duration-200 border-0 h-96 flex flex-col">
                        <div className="p-6 flex flex-col flex-1">
                          {/* Question Title */}
                          <div className="mb-4 flex-shrink-0">
                            <h3 className="font-semibold text-lg leading-tight line-clamp-3 text-gray-800">
                              {decodeHTML(q.question)}
                            </h3>
                          </div>

                          {/* Badges for category, difficulty, type */}
                          <div className="flex flex-wrap gap-2 mb-4 flex-shrink-0">
                            <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                              {q.category || 'Unknown category'}
                            </Badge>
                            <Badge className={`text-xs ${getDifficultyColor(q.difficulty || '')}`}>
                              {q.difficulty ? q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1) : 'Any'}
                            </Badge>
                            <Badge variant="outline" className="text-xs border-gray-300">
                              {q.type === 'boolean' ? 'True/False' : 'Multiple Choice'}
                            </Badge>
                          </div>

                          {/* All Answers */}
                          <div className="mb-6 flex-grow overflow-y-auto">
                            <p className="text-sm font-medium text-gray-700 mb-2">All Answers:</p>
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                              {q.answers && q.answers.length > 0 ? (
                                q.answers.map((answer, index) => (
                                  <div 
                                    key={index} 
                                    className={`text-sm p-2 rounded-lg border ${
                                      answer === q.correct_answer 
                                        ? 'bg-green-50 text-green-800 font-medium border-green-200' 
                                        : 'text-gray-600 border-gray-200'
                                    }`}
                                  >
                                    {decodeHTML(answer)}
                                    {answer === q.correct_answer && (
                                      <span className="ml-2 text-green-600">✓</span>
                                    )}
                                  </div>
                                ))
                              ) : (
                                <div className="text-sm p-2 rounded-lg bg-green-50 text-green-800 font-medium border border-green-200">
                                  {decodeHTML(q.correct_answer)}
                                  <span className="ml-2 text-green-600">✓</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Remove Button */}
                          <div className="mt-auto flex-shrink-0">
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              onClick={() => removeFavoriteQuestion(q.id)}
                              className="w-full"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Favorite Categories Tab */}
              <TabsContent value="categories" className="space-y-6">
                {favoriteCategories.length === 0 ? (
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-12 text-center">
                      <List className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-3 text-gray-800">No favorite categories</h3>
                      <p className="text-gray-600 text-lg">
                        Add categories to favorites from the Categories page!
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteCategories.map((category) => (
                      <Card key={category.id} className="hover:shadow-lg transition-all duration-200 border-0 h-64 flex flex-col">
                        <div className="p-6 flex flex-col flex-1">
                          {/* Category Header with Star */}
                          <div className="flex items-center gap-3 mb-4 flex-shrink-0">
                            <Star className="w-6 h-6 text-yellow-500 fill-current" />
                            <h3 className="font-semibold text-xl text-gray-800 line-clamp-1">{category.name}</h3>
                          </div>
                          
                          {/* Category Badges */}
                          <div className="flex flex-wrap gap-2 mb-6 flex-shrink-0">
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-sm">
                              Favorite
                            </Badge>
                            <Badge variant="outline" className="text-sm border-gray-300">
                              ID: {category.id}
                            </Badge>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-3 mt-auto flex-shrink-0">
                            <Button 
                              onClick={() => useCategory(category.id)}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 flex-1 h-11"
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Use Category
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => removeFavoriteCategory(category.id)}
                              className="h-11 px-4"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}