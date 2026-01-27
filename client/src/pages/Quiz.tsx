import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trophy, Flame, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useRoute, Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { getLoginUrl } from "@/const";

export default function Quiz() {
  const [, params] = useRoute("/quiz/:courseId");
  const courseId = parseInt(params?.courseId || "1");
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  const { data: questions, isLoading } = trpc.quiz.getQuestions.useQuery({ courseId });
  const submitAttempt = trpc.quiz.submitAttempt.useMutation();

  const currentQuestion = questions?.[currentQuestionIndex];
  const totalQuestions = questions?.length || 0;

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation(getLoginUrl());
    }
  }, [isAuthenticated, setLocation]);

  const handleAnswerSelect = (option: string) => {
    if (showFeedback) return;
    setSelectedAnswer(option);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || !currentQuestion) return;

    const isCorrect = selectedAnswer === currentQuestion.correctOption;
    setShowFeedback(true);

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setCorrectAnswers(correctAnswers + 1);
      
      // Calculate points based on difficulty and streak
      const basePoints = currentQuestion.difficulty === 'hard' ? 50 : 
                         currentQuestion.difficulty === 'medium' ? 30 : 15;
      const streakBonus = Math.min(newStreak * 5, 25);
      const points = basePoints + streakBonus;
      setScore(score + points);
    } else {
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      // Quiz complete
      setQuizComplete(true);
      
      // Submit attempt to backend
      if (user) {
        submitAttempt.mutate({
          courseId,
          score,
          correctAnswers,
          totalQuestions,
          streak,
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <Card className="bg-gray-900 border-gray-800 max-w-md">
          <CardContent className="p-12 text-center">
            <p className="text-gray-400 mb-4">No quiz questions available for this course yet.</p>
            <Link href={`/course/${courseId}`}>
              <Button className="bg-primary">
                Back to Course
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (quizComplete) {
    const percentage = (correctAnswers / totalQuestions) * 100;
    const passed = percentage >= 70;

    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4">
        <Card className="bg-gray-900 border-gray-800 max-w-2xl w-full">
          <CardContent className="p-12 text-center">
            <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${
              passed ? 'bg-green-500/20' : 'bg-orange-500/20'
            }`}>
              <Trophy className={`h-12 w-12 ${passed ? 'text-green-500' : 'text-orange-500'}`} />
            </div>

            <h2 className="text-3xl font-bold mb-4">
              {passed ? '🎉 Congratulations!' : '📚 Keep Learning!'}
            </h2>

            <p className="text-xl text-gray-300 mb-8">
              You scored <span className="text-primary font-bold">{score}</span> points!
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Correct</p>
                <p className="text-2xl font-bold text-green-500">{correctAnswers}/{totalQuestions}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Accuracy</p>
                <p className="text-2xl font-bold text-accent">{percentage.toFixed(0)}%</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Best Streak</p>
                <p className="text-2xl font-bold text-orange-500 flex items-center justify-center gap-1">
                  <Flame className="h-5 w-5" />
                  {streak}
                </p>
              </div>
            </div>

            {passed && (
              <Badge className="bg-green-500 text-white mb-6">
                ✓ Quiz Passed
              </Badge>
            )}

            <div className="flex gap-3 justify-center">
              <Link href={`/course/${courseId}`}>
                <Button variant="outline" className="border-gray-700 text-white">
                  Back to Course
                </Button>
              </Link>
              <Link href="/">
                <Button className="bg-primary">
                  Continue Learning
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentQuestion) return null;

  const options = [
    { letter: 'A', text: currentQuestion.optionA },
    { letter: 'B', text: currentQuestion.optionB },
    { letter: 'C', text: currentQuestion.optionC },
    { letter: 'D', text: currentQuestion.optionD },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-accent border-accent">
                Question {currentQuestionIndex + 1}/{totalQuestions}
              </Badge>
              <Badge variant="outline" className={`${
                currentQuestion.difficulty === 'hard' ? 'text-red-500 border-red-500' :
                currentQuestion.difficulty === 'medium' ? 'text-orange-500 border-orange-500' :
                'text-green-500 border-green-500'
              }`}>
                {currentQuestion.difficulty.toUpperCase()}
              </Badge>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-900 rounded-lg">
                <Trophy className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">{score}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-900 rounded-lg">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-semibold">{streak}</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 bg-gray-800 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
      </header>

      {/* Question */}
      <main className="container mx-auto px-4 py-12">
        <Card className="bg-gray-900 border-gray-800 max-w-3xl mx-auto">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-8">{currentQuestion.question}</h2>

            <div className="space-y-3 mb-8">
              {options.map((option) => {
                const isSelected = selectedAnswer === option.letter;
                const isCorrect = option.letter === currentQuestion.correctOption;
                const showCorrect = showFeedback && isCorrect;
                const showIncorrect = showFeedback && isSelected && !isCorrect;

                return (
                  <button
                    key={option.letter}
                    onClick={() => handleAnswerSelect(option.letter)}
                    disabled={showFeedback}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      showCorrect ? 'border-green-500 bg-green-500/20' :
                      showIncorrect ? 'border-red-500 bg-red-500/20' :
                      isSelected ? 'border-primary bg-primary/10' :
                      'border-gray-700 bg-gray-800 hover:border-gray-600'
                    } ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          showCorrect ? 'bg-green-500 text-white' :
                          showIncorrect ? 'bg-red-500 text-white' :
                          isSelected ? 'bg-primary text-white' :
                          'bg-gray-700 text-gray-300'
                        }`}>
                          {option.letter}
                        </span>
                        <span>{option.text}</span>
                      </div>
                      {showCorrect && <CheckCircle className="h-6 w-6 text-green-500" />}
                      {showIncorrect && <XCircle className="h-6 w-6 text-red-500" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {showFeedback && currentQuestion.explanation && (
              <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-sm text-blue-200">
                  <strong>Explanation:</strong> {currentQuestion.explanation}
                </p>
              </div>
            )}

            <div className="flex justify-end">
              {!showFeedback ? (
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={!selectedAnswer}
                  className="bg-primary hover:opacity-90 disabled:opacity-50"
                >
                  Submit Answer
                </Button>
              ) : (
                <Button
                  onClick={handleNextQuestion}
                  className="bg-primary hover:opacity-90"
                >
                  {currentQuestionIndex < totalQuestions - 1 ? (
                    <>
                      Next Question
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    'Finish Quiz'
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
