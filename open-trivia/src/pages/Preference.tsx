import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, CheckCircle, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface PreferencesProps {
  difficulty: string;
  setDifficulty: (value: string) => void;
  questionType: string;
  setQuestionType: (value: string) => void;
}

export default function Preferences({ difficulty, setDifficulty, questionType, setQuestionType }: PreferencesProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [showProceed, setShowProceed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const savedPrefs = localStorage.getItem('quizPreferences');
      if (savedPrefs) {
        const prefs = JSON.parse(savedPrefs);
        setDifficulty(prefs.difficulty || '');
        setQuestionType(prefs.questionType || 'multiple');
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error loading saved preferences:', error);
    }
  }, [setDifficulty, setQuestionType]);

  const savePreferences = () => {
    const preferences = {
      difficulty,
      questionType,
      savedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem('quizPreferences', JSON.stringify(preferences));
      setIsSaved(true);
      setTimeout(() => setShowProceed(true), 500);
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  const resetPreferences = () => {
    setDifficulty('');
    setQuestionType('multiple');
    setIsSaved(false);
    setShowProceed(false);

    try {
      localStorage.removeItem('quizPreferences');
    } catch (error) {
      console.error('Error removing preferences:', error);
    }
  };

  const proceedToQuiz = () => {
    navigate('/Dashboard');
  };

  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <Card className="shadow-lg border-0">
          <CardHeader className="text-center pb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Settings className="w-8 h-8 text-blue-600" />
              <CardTitle className="text-3xl font-bold text-gray-900">Quiz Preferences</CardTitle>
            </div>
            <CardDescription className="text-lg text-gray-600 max-w-2xl mx-auto">
              Customize your quiz experience. Your settings will be applied to all new quizzes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {isSaved && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center animate-in fade-in duration-500">
                <div className="flex items-center justify-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <h4 className="font-semibold text-green-800 text-lg">Preferences Saved Successfully!</h4>
                    <p className="text-green-700">
                      Your quiz settings have been saved. You can now proceed to the quiz or make further changes.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid gap-8 lg:grid-cols-2">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900 text-center">Difficulty Level</h3>
                  <RadioGroup
                    value={difficulty}
                    onValueChange={(value: string) => {
                      setDifficulty(value);
                      setIsSaved(false);
                      setShowProceed(false);
                    }}
                    className="space-y-4"
                  >
                    <div className="flex items-start space-x-4 p-4 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                      <RadioGroupItem value="" id="all" />
                      <div className="flex-1">
                        <Label htmlFor="all" className="cursor-pointer">
                          <div className="font-medium text-gray-900">All Difficulties</div>
                          <div className="text-gray-600 mt-2">
                            Mix of easy, medium, and hard questions
                          </div>
                        </Label>
                      </div>
                      <div className="flex gap-1 pt-1">
                        <div className="w-3 h-6 bg-green-400 rounded"></div>
                        <div className="w-3 h-6 bg-yellow-400 rounded"></div>
                        <div className="w-3 h-6 bg-red-400 rounded"></div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 p-4 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                      <RadioGroupItem value="easy" id="easy" />
                      <div className="flex-1">
                        <Label htmlFor="easy" className="cursor-pointer">
                          <div className="font-medium text-gray-900">Easy</div>
                          <div className="text-gray-600 mt-2">
                            Perfect for beginners
                          </div>
                        </Label>
                      </div>
                      <div className="flex gap-1 pt-1">
                        <div className="w-3 h-6 bg-green-400 rounded"></div>
                        <div className="w-3 h-6 bg-gray-200 rounded"></div>
                        <div className="w-3 h-6 bg-gray-200 rounded"></div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 p-4 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                      <RadioGroupItem value="medium" id="medium" />
                      <div className="flex-1">
                        <Label htmlFor="medium" className="cursor-pointer">
                          <div className="font-medium text-gray-900">Medium</div>
                          <div className="text-gray-600 mt-2">
                            Balanced challenge
                          </div>
                        </Label>
                      </div>
                      <div className="flex gap-1 pt-1">
                        <div className="w-3 h-6 bg-green-400 rounded"></div>
                        <div className="w-3 h-6 bg-yellow-400 rounded"></div>
                        <div className="w-3 h-6 bg-gray-200 rounded"></div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 p-4 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                      <RadioGroupItem value="hard" id="hard" />
                      <div className="flex-1">
                        <Label htmlFor="hard" className="cursor-pointer">
                          <div className="font-medium text-gray-900">Hard</div>
                          <div className="text-gray-600 mt-2">
                            For trivia experts
                          </div>
                        </Label>
                      </div>
                      <div className="flex gap-1 pt-1">
                        <div className="w-3 h-6 bg-green-400 rounded"></div>
                        <div className="w-3 h-6 bg-yellow-400 rounded"></div>
                        <div className="w-3 h-6 bg-red-400 rounded"></div>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900 text-center">Question Type</h3>
                  <RadioGroup
                    value={questionType}
                    onValueChange={(value: string) => {
                      setQuestionType(value);
                      setIsSaved(false);
                      setShowProceed(false);
                    }}
                    className="space-y-4"
                  >
                    <div className="flex items-start space-x-4 p-4 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                      <RadioGroupItem value="multiple" id="multiple" />
                      <div className="flex-1">
                        <Label htmlFor="multiple" className="cursor-pointer">
                          <div className="font-medium text-gray-900">Multiple Choice</div>
                          <div className="text-gray-600 mt-2">
                            Choose from 4 different options
                          </div>
                        </Label>
                      </div>
                      <div className="text-2xl pt-1">🔠</div>
                    </div>

                    <div className="flex items-start space-x-4 p-4 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                      <RadioGroupItem value="boolean" id="boolean" />
                      <div className="flex-1">
                        <Label htmlFor="boolean" className="cursor-pointer">
                          <div className="font-medium text-gray-900">True / False</div>
                          <div className="text-gray-600 mt-2">
                            Simple true or false questions
                          </div>
                        </Label>
                      </div>
                      <div className="text-2xl pt-1">✅❌</div>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
              <h4 className="font-semibold text-blue-800 text-lg mb-4">Current Settings</h4>
              <div className="text-blue-700 space-y-3 text-lg">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  <p><strong>Difficulty:</strong> {difficulty === '' ? 'All Difficulties' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</p>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  <p><strong>Question Type:</strong> {questionType === 'multiple' ? 'Multiple Choice' : 'True/False'}</p>
                </div>
                {isSaved && (
                  <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-blue-300">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="text-green-700 font-medium text-lg">Settings are saved and ready to use</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <Button
                onClick={resetPreferences}
                variant="outline"
                className="sm:flex-1 h-12 text-base border-gray-300"
              >
                Reset to Default
              </Button>

              <div className="flex flex-col sm:flex-row gap-4 sm:flex-1">
                <Button
                  onClick={savePreferences}
                  className="bg-blue-600 hover:bg-blue-700 flex-1 h-12 text-base"
                  disabled={isSaved}
                >
                  {isSaved ? (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Preferences Saved
                    </>
                  ) : (
                    'Save Preferences'
                  )}
                </Button>

                {showProceed && (
                  <Button
                    onClick={proceedToQuiz}
                    className="bg-green-600 hover:bg-green-700 flex-1 h-12 text-base animate-in slide-in-from-right duration-500"
                  >
                    <ArrowRight className="w-5 h-5 mr-2" />
                    Proceed to Quiz
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}