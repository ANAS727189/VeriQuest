"use client";
import React, { useEffect, useState } from "react";
import { Mic, MicOff, Camera, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Webcam from "react-webcam";
import useSpeechToText from "react-hook-speech-to-text";
import { chatSession } from "@/utils/Gemini";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

const RecordAns = ({ mockInterviewQuestions, activeQuestionIndex, interviewData }) => {
  const [userAnswer, setUserAnswer] = useState("");
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const {
    error,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: false,
    useLegacyResults: false,
  });

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Web Speech API is not supported in this browser.");
    }
  }, []);

  const handleUserMediaError = (error) => {
    console.error("Webcam error:", error);
    toast.error("Failed to access webcam. Please check your permissions.");
  };

  useEffect(() => {
    results.forEach((res) => {
      setUserAnswer((prevAnswer) => prevAnswer + res?.transcript);
    });
  }, [results]);

  useEffect(() => {
    if (!isRecording && userAnswer?.length > 10) {
      updateUserInDb();
    }
    if (isRecording && userAnswer?.length < 10) {
      setLoading(false);
      toast.error("Error while saving answer");
    }
  }, [userAnswer, isRecording]);

  const toggleRecording = async () => {
    if (isRecording) {
      stopSpeechToText();
    } else {
      startSpeechToText();
    }
  };

  const updateUserInDb = async () => {
    setLoading(true);
    const feedBackPrompt =
    "Question: " +
    mockInterviewQuestions[activeQuestionIndex]?.question +
    ", User Answer: " +
    userAnswer +
    "depends on question and user answer for given interview question . Please give us rating for answer and feedback as area of improvement(even if answer is wrong tell it and explain correct answer), if any ." +
    "Provide feedback in just 5-6 lines in JSON Format with rating field and feedback field";

  const res = await chatSession.sendMessage(feedBackPrompt);
  const mockJsonRes = res.response.text();
  console.log(mockJsonRes);

  const JsonFeedbackRes = JSON.parse(mockJsonRes);

  const resp = await db.insert(userAnswer).values({
    mockIdRef: interviewData?.mockId,
    question: mockInterviewQuestions[activeQuestionIndex]?.question,
    correctAns: mockInterviewQuestions[activeQuestionIndex]?.correctAns,
    userAnswer: userAnswer,
    feedback: JsonFeedbackRes.feedback,
    rating: JsonFeedbackRes.rating,
    userEmail: user?.primaryEmailAddress?.emailAddress,
    createdAt: moment().format("DD-MM-YYYY"),
  });

  if (resp) {
    toast("Answer saved successfully", { type: "success" });
    setUserAnswer("");
    setResults([]);
  }

  setResults([]);
  setUserAnswer("");
  setLoading(false);
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Record Your Answer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-full max-w-md aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <Webcam
              className="w-full h-full object-cover"
              onUserMediaError={handleUserMediaError}
            />
            <div className="absolute top-2 right-2">
              <Camera className="h-6 w-6 text-white" />
            </div>
          </div>

          <Button
            variant={isRecording ? "destructive" : "default"}
            className="w-full max-w-xs"
            disabled={loading}
            onClick={toggleRecording}
          >
            {isRecording ? (
              <>
                <MicOff className="mr-2 h-4 w-4" /> Stop Recording
              </>
            ) : (
              <>
                <Mic className="mr-2 h-4 w-4" /> Start Recording
              </>
            )}
          </Button>

          {isRecording && (
            <div className="text-red-500 animate-pulse flex items-center">
              <AlertCircle className="mr-2 h-4 w-4" /> Recording in progress...
            </div>
          )}

          {userAnswer && (
            <div className="w-full max-w-md mt-4">
              <h3 className="font-semibold mb-2">Your Answer:</h3>
              <p className="bg-gray-100 p-3 rounded-md">{userAnswer}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecordAns;