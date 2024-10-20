"use client";

import React, { useEffect, useState } from 'react';
import { UserAnswer } from '@/utils/schema';
import { db } from "@/utils/db";
import { eq } from 'drizzle-orm';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown, Star, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Feedback = ({ params }) => {
  const [feedbackList, setFeedbackList] = useState([]);
  const router = useRouter();

  useEffect(() => {
    GetFeedback();
  }, []);

  const GetFeedback = async () => {
    const res = await db.select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, params.interviewId))
      .orderBy(UserAnswer.id);
    setFeedbackList(res);
  };

  const calculateAverageScore = () => {
    if (feedbackList.length === 0) return 0;
    const totalScore = feedbackList.reduce((sum, item) => sum + parseInt(item.rating), 0);
    return (totalScore / feedbackList.length).toFixed(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-green-500">Congratulations!</CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-2xl font-bold mb-4">Here is your Interview feedback</h2>
          {feedbackList.length === 0 ? (
            <p className="text-xl text-red-500 font-bold">No Interview record found.</p>
          ) : (
            <>
              <div className="flex items-center mb-4">
                <Star className="text-yellow-400 w-6 h-6 mr-2" />
                <span className="text-lg">
                  Your interview score: <strong>{calculateAverageScore()}/10</strong>
                </span>
              </div>
              <p className="text-sm text-gray-500">
                Want to improve? Find below interview questions with correct answers and feedback for improvement.
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {feedbackList.map((item, index) => (
        <Collapsible key={index} className="mb-4">
          <CollapsibleTrigger className="w-full p-4 bg-secondary rounded-t-lg text-left flex justify-between items-center">
            <span className="font-medium">{item.question}?</span>
            <ChevronsUpDown className="h-5 w-5" />
          </CollapsibleTrigger>
          <CollapsibleContent className="bg-white border border-t-0 rounded-b-lg p-4">
            <div className="space-y-4">
              <div className="bg-yellow-50 p-3 rounded-lg">
                <strong className="text-yellow-700">Rating: </strong>
                <span className="text-yellow-600">{item.rating}/10</span>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <strong className="text-red-700">Your answer: </strong>
                <span className="text-red-600">{item.userAnswer}</span>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <strong className="text-green-700">Correct answer: </strong>
                <span className="text-green-600">{item.correctAns}</span>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <strong className="text-blue-700">Feedback: </strong>
                <span className="text-blue-600">{item.feedback}</span>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}

      <Button
        onClick={() => router.replace('/dashboard/')}
        className="mt-8 flex items-center"
      >
        <Home className="mr-2 h-4 w-4" />
        Go Home
      </Button>
    </div>
  );
};

export default Feedback;