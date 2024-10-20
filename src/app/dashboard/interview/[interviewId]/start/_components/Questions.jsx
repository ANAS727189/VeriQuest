import React, { useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Volume2 } from "lucide-react";

const QuestionSection = ({ mockInterviewQuestions, activeQuestionIndex }) => {
  const textToSpeech = useCallback((text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setTimeout(() => {
        const speech = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(speech);
      }, 100);
    } else {
      alert("Your browser does not support text-to-speech");
    }
  }, []);

  const handleSpeakQuestion = useCallback(() => {
    const currentQuestion =
      mockInterviewQuestions[activeQuestionIndex]?.question;
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
      <div className="text-center py-8">
        <Lightbulb className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <p className="text-lg">No questions available</p>
      </div>
    );
  }

  const currentQuestion = mockInterviewQuestions[activeQuestionIndex];

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="p-2  flex flex-col text-2xl font-bold text-center">
            <lord-icon
              src="https://cdn.lordicon.com/warimioc.json"
              trigger="hover"
              stroke="bold"
              colors="primary:#8930e8,secondary:#4f1091"
              style={{ width: 80, height: 80 }}
            ></lord-icon>
            Interview Questions
          </CardTitle>
          <span className="flex justify-end text-md text-gray-500">
            {activeQuestionIndex + 1}/15
          </span>
        </CardHeader>
        <CardContent>
          <Card className="bg-gray-50 dark:bg-gray-800">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Question #{activeQuestionIndex + 1}
              </h3>
              <p className="text-xl mb-4">{currentQuestion.question}</p>
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => textToSpeech(currentQuestion.question)}
                  className="flex items-center gap-2"
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
        <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>Note: {process.env.NEXT_PUBLIC_QUESTION_NOTE}</p>
        </div>
      )}
    </div>
  );
};

export default QuestionSection;
