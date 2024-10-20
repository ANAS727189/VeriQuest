import React, { useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Volume2 } from 'lucide-react';
import { useTheme } from "@/context/ThemeContext";

const QuestionSection = ({ mockInterviewQuestions, activeQuestionIndex }) => {
  const { darkMode } = useTheme(); // Use dark mode context

  const textToSpeech = useCallback((text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setTimeout(() => {
        const speech = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(speech);
      }, 100);
    } else {
      alert('Your browser does not support text-to-speech');
    }
  }, []);

  const handleSpeakQuestion = useCallback(() => {
    const currentQuestion = mockInterviewQuestions[activeQuestionIndex]?.question;
    if (currentQuestion) {
      textToSpeech(currentQuestion);
    }
  }, [mockInterviewQuestions, activeQuestionIndex, textToSpeech]);

  useEffect(() => {
    if (mockInterviewQuestions && mockInterviewQuestions.length > 0) {
      handleSpeakQuestion();
    }
  }, [mockInterviewQuestions, activeQuestionIndex, handleSpeakQuestion]);

  if (!mockInterviewQuestions || mockInterviewQuestions.length === 0) {
    return (
      <div className={`text-center py-8 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'}`}>
        <Lightbulb className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <p className="text-lg font-semibold">No questions available</p>
      </div>
    );
  }

  const currentQuestion = mockInterviewQuestions[activeQuestionIndex];

  return (
    <div className={`container mx-auto px-4 py-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <Card className={`w-full max-w-3xl mx-auto shadow-lg rounded-lg ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
        <CardHeader className="flex justify-between items-center">
          <CardTitle className={`flex items-center text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            <lord-icon
              src="https://cdn.lordicon.com/warimioc.json"
              trigger="hover"
              stroke="bold"
              colors="primary:#8930e8,secondary:#4f1091"
              style={{ width: 60, height: 60 }}
            />
            <span className="ml-4">Interview Questions</span>
          </CardTitle>
          <span className={`text-md ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{activeQuestionIndex + 1}/15</span>
        </CardHeader>
        <CardContent>
          <Card className={`rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <CardContent className="p-6">
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                Question #{activeQuestionIndex + 1}
              </h3>
              <p className={`text-xl mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{currentQuestion.question}</p>
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => textToSpeech(currentQuestion.question)}
                  className={`flex items-center gap-2 border-gray-300 hover:bg-gray-100 ${darkMode ? 'dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700' : 'text-gray-700'}`}
                >
                  <Volume2 className="h-4 w-4" />
                  Speak
                </Button>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
      {process.env.NEXT_PUBLIC_QUESTION_NOTE && (
        <div className={`mt-8 text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <p>Note: {process.env.NEXT_PUBLIC_QUESTION_NOTE}</p>
        </div>
      )}
    </div>
  );
};

export default QuestionSection;
