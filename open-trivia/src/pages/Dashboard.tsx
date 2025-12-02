import { useEffect, useState } from 'react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import axios from 'axios';
import { Star, StarOff, Settings, RefreshCw, Trophy, Award, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate, useLocation } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';

interface Question {
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
    category: string;
    difficulty: string;
    type: string;
}

interface AnsweredQuestion extends Question {
    selectedAnswer: string;
    isCorrect: boolean;
}

interface DashboardProps {
    difficulty: string;
    questionType: string;
}

const DEFAULT_QUESTIONS = 10;

const Dashboard = ({ difficulty, questionType }: DashboardProps) => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [answeredQuestions, setAnsweredQuestions] = useState<AnsweredQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [favoriteQuestions, setFavoriteQuestions] = useState<Set<string>>(new Set());
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Load selected category from localStorage and get category name
    useEffect(() => {
        const loadCategory = async () => {
            try {
                const savedCategory = localStorage.getItem("selectedCategory");
                if (savedCategory) {
                    const categoryId = JSON.parse(savedCategory);
                    setSelectedCategory(categoryId);
                    
                    // If we have a category ID, fetch the category name
                    if (categoryId && categoryId !== 'any') {
                        await fetchCategoryName(categoryId);
                    } else {
                        setSelectedCategoryName(null);
                    }
                } else {
                    setSelectedCategory(null);
                    setSelectedCategoryName(null);
                }
            } catch {
                setSelectedCategory(null);
                setSelectedCategoryName(null);
            }
        };

        loadCategory();
    }, [location.search]); // Add location.search dependency to reload when URL changes

    // Fetch category name from API
    const fetchCategoryName = async (categoryId: string) => {
        try {
            const response = await axios.get("https://opentdb.com/api_category.php");
            const categories = response.data.trivia_categories;
            const category = categories.find((cat: any) => String(cat.id) === categoryId);
            if (category) {
                setSelectedCategoryName(category.name);
            } else {
                setSelectedCategoryName(`Category ${categoryId}`);
            }
        } catch {
            setSelectedCategoryName(`Category ${categoryId}`);
        }
    };

    // Fetch questions when preferences, category, or URL changes
    useEffect(() => {
        // Reset quiz state when category changes
        setAnsweredQuestions([]);
        setCurrentQuestionIndex(0);
        setQuizCompleted(false);
        fetchQuestions();
    }, [difficulty, questionType, selectedCategory, location.search]);

    // Load favorite questions from localStorage
    useEffect(() => {
        try {
            const raw = localStorage.getItem('favoriteQuestions');
            if (raw) {
                const favs = JSON.parse(raw);
                const questionIds = favs.map((q: any) => q.id);
                setFavoriteQuestions(new Set(questionIds));
            }
        } catch {
            // ignore
        }
    }, []);

    // Fetch questions from API based on preferences
    const fetchQuestions = async () => {
        try {
            setLoading(true);
            setError(null);

            // Build API URL based on preferences and selected category
            let apiUrl = `https://opentdb.com/api.php?amount=${DEFAULT_QUESTIONS}&type=${questionType}`;

            if (difficulty && difficulty !== '') {
                apiUrl += `&difficulty=${difficulty}`;
            }

            if (selectedCategory && selectedCategory !== 'any') {
                apiUrl += `&category=${selectedCategory}`;
            }

            console.log('Fetching questions from:', apiUrl); // Debug log

            const response = await axios.get(apiUrl);

            if (response.data.results.length === 0) {
                setError('No questions found with current preferences. Try changing your settings.');
                await fetchFallbackQuestions();
            } else {
                // Filter results to ensure we only get the requested question type AND difficulty
                const filteredResults = response.data.results.filter((q: Question) => {
                    const typeMatches = q.type === questionType;
                    const difficultyMatches = difficulty === '' || q.difficulty === difficulty;
                    return typeMatches && difficultyMatches;
                });
                
                if (filteredResults.length === 0 && questionType === 'boolean') {
                    setError('No True/False questions available for these settings. Try Multiple Choice or different category/difficulty.');
                    setLoading(false);
                } else if (filteredResults.length === 0 && difficulty !== '') {
                    setError(`No ${difficulty} difficulty questions available for these settings. Try a different difficulty or category.`);
                    setLoading(false);
                } else if (filteredResults.length > 0) {
                    setQuestions(filteredResults);
                    setError(null);
                } else {
                    setError('No questions found with current preferences. Try changing your settings.');
                    await fetchFallbackQuestions();
                }
            }

            setLoading(false);
        } catch (err) {
            console.error('Error fetching questions:', err);
            setError('Failed to load questions. Please check your preferences.');
            setLoading(false);
            if (questions.length === 0) {
                await fetchFallbackQuestions();
            }
        }
    };

    // Separate fallback function to avoid code duplication
    const fetchFallbackQuestions = async () => {
        try {
            const fallbackResponse = await axios.get(`https://www.otriviata.com/api.php?amount=${DEFAULT_QUESTIONS}&type=${questionType}`);
            if (fallbackResponse.data.results.length > 0) {
                let fallbackQuestions = fallbackResponse.data.results;
                
                if (difficulty && difficulty !== '') {
                    const difficultyFiltered = fallbackQuestions.filter((q: Question) => q.difficulty === difficulty);
                    if (difficultyFiltered.length > 0) {
                        fallbackQuestions = difficultyFiltered;
                    }
                }
                
                setQuestions(fallbackQuestions);
                setError(null);
                setLoading(false);
            } else {
                setError('Unable to load any questions. Please try again later.');
                setLoading(false);
            }
        } catch (fallbackErr) {
            setError('Unable to load any questions. Please try again later.');
            setLoading(false);
        }
    };

    // Decode HTML entities in question text
    const decodeHTML = (html: string) => {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    };

    // Handle user answer selection
    const handleAnswerClick = (answer: string, question: Question) => {
        if (answeredQuestions.some(aq => aq.question === question.question)) {
            return; // Already answered
        }

        const isCorrect = answer === question.correct_answer;
        const answeredQuestion: AnsweredQuestion = {
            ...question,
            selectedAnswer: answer,
            isCorrect
        };

        const newAnsweredQuestions = [...answeredQuestions, answeredQuestion];
        setAnsweredQuestions(newAnsweredQuestions);

        // Move to next question or complete quiz
        if (currentQuestionIndex < questions.length - 1) {
            setTimeout(() => {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            }, 1500);
        } else {
            setTimeout(() => {
                setQuizCompleted(true);
            }, 1500);
        }
    };

    // Determine answer button color based on correctness
    const getAnswerColor = (answer: string, question: Question) => {
        const answeredQuestion = answeredQuestions.find(aq => aq.question === question.question);

        if (!answeredQuestion) return 'border-gray-200 hover:bg-blue-50';

        if (answer === question.correct_answer) {
            return 'bg-green-500 text-white border-green-600';
        }

        if (answer === answeredQuestion.selectedAnswer && answer !== question.correct_answer) {
            return 'bg-red-500 text-white border-red-600';
        }

        return 'border-gray-200 bg-gray-100';
    };

    // Toggle favorite status of a question
    const toggleFavoriteQuestion = (question: Question) => {
        const questionId = btoa(question.question); // Simple ID generation

        // Load current favorites
        const raw = localStorage.getItem('favoriteQuestions');
        const currentFavorites = raw ? JSON.parse(raw) : [];

        if (favoriteQuestions.has(questionId)) {
            // Remove from favorites
            const updatedFavorites = currentFavorites.filter((q: any) => q.id !== questionId);
            localStorage.setItem('favoriteQuestions', JSON.stringify(updatedFavorites));
            setFavoriteQuestions(prev => {
                const next = new Set(prev);
                next.delete(questionId);
                return next;
            });
        } else {
            // Add to favorites
            const newFavorite = {
                id: questionId,
                question: question.question,
                category: question.category,
                difficulty: question.difficulty,
                type: question.type,
                correct_answer: question.correct_answer,
                incorrect_answers: question.incorrect_answers,
                answers: question.incorrect_answers.concat(question.correct_answer).sort()
            };

            const updatedFavorites = [...currentFavorites, newFavorite];
            localStorage.setItem('favoriteQuestions', JSON.stringify(updatedFavorites));
            setFavoriteQuestions(prev => new Set(prev).add(questionId));
        }
    };

    // Reset quiz to start over
    const resetQuiz = () => {
        setAnsweredQuestions([]);
        setCurrentQuestionIndex(0);
        setQuizCompleted(false);
        fetchQuestions();
    };

    // Clear selected category
    const clearCategory = () => {
        setSelectedCategory(null);
        setSelectedCategoryName(null);
        localStorage.removeItem("selectedCategory");
        fetchQuestions();
    };

    const goToPreferences = () => {
        navigate('/preferences');
    };

    const goToCategories = () => {
        navigate('/categories');
    };

    // Calculate score and percentage
    const score = answeredQuestions.filter(q => q.isCorrect).length;
    const totalQuestions = questions.length;
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

    // Get score message based on performance
    const getScoreMessage = () => {
        if (percentage === 100) return { message: 'Perfect Score! 🎉', color: 'text-green-600', icon: Trophy };
        if (percentage >= 80) return { message: 'Excellent! 🏆', color: 'text-blue-600', icon: Award };
        if (percentage >= 60) return { message: 'Good Job! 👍', color: 'text-yellow-600', icon: Target };
        if (percentage >= 40) return { message: 'Not Bad! 💪', color: 'text-orange-600', icon: Target };
        return { message: 'Keep Practicing! 📚', color: 'text-red-600', icon: RefreshCw };
    };

    const scoreInfo = getScoreMessage();
    const ScoreIcon = scoreInfo.icon;

    // Quiz completion screen
    if (quizCompleted) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="w-full max-w-4xl">
                    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                        <div className="flex justify-center mb-6">
                            <ScoreIcon className={`w-16 h-16 ${scoreInfo.color}`} />
                        </div>

                        <h1 className="text-4xl font-bold mb-2">Quiz Completed!</h1>
                        <p className={`text-xl font-semibold mb-8 ${scoreInfo.color}`}>
                            {scoreInfo.message}
                        </p>

                        {/* Overall Score Display */}
                        <div className="mb-8">
                            <div className="text-6xl font-bold mb-2 text-blue-600">
                                {score}<span className="text-2xl text-gray-500">/{totalQuestions}</span>
                            </div>
                            <div className="text-2xl font-semibold text-gray-600 mb-4">
                                {percentage}%
                            </div>
                            <Progress value={percentage} className="h-3 bg-gray-200" />
                        </div>

                        {/* Score Breakdown */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                <div className="text-2xl font-bold text-green-600">{score}</div>
                                <div className="text-sm text-green-700">Correct Answers</div>
                            </div>
                            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                <div className="text-2xl font-bold text-red-600">{totalQuestions - score}</div>
                                <div className="text-sm text-red-700">Incorrect Answers</div>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <div className="text-2xl font-bold text-blue-600">{percentage}%</div>
                                <div className="text-sm text-blue-700">Success Rate</div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button onClick={resetQuiz} className="bg-blue-600 hover:bg-blue-700 sm:flex-1 max-w-48">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                New Quiz
                            </Button>
                            <Button onClick={goToPreferences} variant="outline" className="sm:flex-1 max-w-48">
                                <Settings className="w-4 h-4 mr-2" />
                                Change Preferences
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6">
            {/* Fixed Header Section */}
            <div className="w-full max-w-4xl mx-auto mb-6">
                <div>
                    <h1 className="text-4xl font-bold mb-4">Quiz Dashboard</h1>
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">
                            Type: {questionType === 'multiple' ? 'Multiple Choice' : 'True/False'}
                        </Badge>
                        <Badge variant="secondary">
                            Difficulty: {difficulty === '' ? 'All' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                        </Badge>
                        {selectedCategoryName ? (
                            <Badge className="bg-purple-100 text-purple-800">
                                Category: {selectedCategoryName}
                                <button
                                    onClick={clearCategory}
                                    className="ml-2 text-purple-600 hover:text-purple-800"
                                >
                                    ×
                                </button>
                            </Badge>
                        ) : (
                            <Badge variant="outline">All Categories</Badge>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Section - Centered */}
            <div className="flex items-center justify-center">
                <div className="w-full max-w-4xl">
                    {loading && (
                        <div className="text-center py-8">
                            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-blue-600" />
                            <p className="text-lg">Loading questions with your preferences...</p>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <p className="text-red-700 mb-3">{error}</p>
                            <Button onClick={fetchQuestions} variant="outline" size="sm">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Retry
                            </Button>
                        </div>
                    )}

                    {questions.length > 0 && !loading && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <div className="text-sm text-gray-500">
                                    Question {currentQuestionIndex + 1} of {questions.length}
                                </div>
                                <div className="text-sm font-medium">
                                    Score: {score}/{totalQuestions}
                                </div>
                            </div>

                            {/* Carousel for questions */}
                            <Carousel className="w-full" opts={{ startIndex: currentQuestionIndex }}>
                                <CarouselContent>
                                    {questions.map((question, index) => (
                                        <CarouselItem key={index} className="flex items-center justify-center">
                                            <div className="w-full p-8 border rounded-lg shadow-lg bg-white">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex-1">
                                                        <h2 className="text-2xl font-bold mt-2">{decodeHTML(question.question)}</h2>
                                                    </div>
                                                    {/* Favorite button */}
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => toggleFavoriteQuestion(question)}
                                                        className="ml-4"
                                                    >
                                                        {favoriteQuestions.has(btoa(question.question)) ? (
                                                            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                                        ) : (
                                                            <StarOff className="w-5 h-5 text-gray-400" />
                                                        )}
                                                    </Button>
                                                </div>
                                                {/* Answer options */}
                                                <div className="space-y-3 mb-6">
                                                    {question.incorrect_answers.concat(question.correct_answer)
                                                        .sort()
                                                        .map((answer: string, idx: number) => (
                                                            <button
                                                                key={idx}
                                                                onClick={() => handleAnswerClick(answer, question)}
                                                                disabled={answeredQuestions.some(aq => aq.question === question.question)}
                                                                className={`w-full p-4 text-left border rounded-lg transition-all duration-300 ${getAnswerColor(answer, question)} ${!answeredQuestions.some(aq => aq.question === question.question)
                                                                    ? 'hover:bg-blue-50 cursor-pointer'
                                                                    : 'cursor-default'
                                                                    }`}
                                                            >
                                                                {decodeHTML(answer)}
                                                            </button>
                                                        ))}
                                                </div>
                                               
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious />
                                <CarouselNext />
                            </Carousel>
                        </div>
                    )}

                    {questions.length === 0 && !loading && !error && (
                        <div className="text-center py-12">
                            <p className="text-lg mb-4">No questions available with current preferences.</p>
                            <div className="flex gap-3 justify-center">
                                <Button onClick={goToCategories}>
                                    Choose Category
                                </Button>
                                <Button onClick={goToPreferences} variant="outline">
                                    <Settings className="w-4 h-4 mr-2" />
                                    Change Preferences
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;