"use client";
import React, { useEffect, useState } from 'react';
import { AIinterview } from '@/utils/schema';
import { db } from '@/utils/db';
import { eq } from 'drizzle-orm';
import QuestionSection from './_components/Questions';
import RecordAns from './_components/RecordAns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

const StartInterview = ({ params }) => {
  const [interviewData, setInterviewData] = useState(null);
  const [mockInterviewQuestions, setMockInterviewQuestions] = useState(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  useEffect(() => {
    GetInterviewDetail();
  }, []);

  const GetInterviewDetail = async () => {
    const res = await db
      .select()
      .from(AIinterview)
      .where(eq(AIinterview.mockId, params.interviewId));
    const jsonMockRes = JSON.parse(res[0].jsonMockResp);
    console.log("Parsed jsonMockResp:", jsonMockRes);
    
    if (res.length > 0) {
      setInterviewData(res[0]);
      setMockInterviewQuestions(jsonMockRes.questions);
    }
  };

  const handleQuestionChange = (newIndex) => {
    setActiveQuestionIndex(newIndex);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Mock Interview</h1>
      
      <QuestionSection
        mockInterviewQuestions={mockInterviewQuestions}
        activeQuestionIndex={activeQuestionIndex}
      />
      
      <RecordAns
        mockInterviewQuestions={mockInterviewQuestions}
        activeQuestionIndex={activeQuestionIndex}
        interviewData={interviewData}
      />
      
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={() => handleQuestionChange(activeQuestionIndex - 1)}
          disabled={activeQuestionIndex === 0}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous Question
        </Button>
        
        {activeQuestionIndex < mockInterviewQuestions?.length - 1 ? (
          <Button
            onClick={() => handleQuestionChange(activeQuestionIndex + 1)}
            className="flex items-center gap-2"
          >
            Next Question
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Link href={`/dashboard/interview/${interviewData?.mockId}/feedback`}>
            <Button className="flex items-center gap-2">
              End Interview
              <CheckCircle className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default StartInterview;