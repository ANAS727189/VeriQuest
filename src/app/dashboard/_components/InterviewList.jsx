"use client";

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { db } from '@/utils/db';
import { AIinterview } from '@/utils/schema';
import { desc, eq } from 'drizzle-orm';
import InterviewItemCard from './InterviewItemCard';
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "@/context/ThemeContext";

const InterviewList = () => {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { darkMode } = useTheme();

  useEffect(() => {
    if (user) {
      getInterviewList();
    }
  }, [user]);

  const getInterviewList = async () => {
    setIsLoading(true); 
    const res = await db
      .select()
      .from(AIinterview)
      .where(eq(AIinterview.createdBy, user?.primaryEmailAddress?.emailAddress))
      .orderBy(desc(AIinterview.id));
    setInterviewList(res);
    setIsLoading(false);
  };

  return (
    <div className={`mt-10 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} p-6 rounded-lg shadow-md`}>
      <h2 className={`font-bold text-2xl mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Previous Mock Interviews
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? Array(3)
              .fill(0)
              .map((_, index) => (
                <Skeleton 
                  key={index} 
                  className={`h-[150px] w-full rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-300'}`} 
                />
              ))
          : interviewList.map((interview, index) => (
              <InterviewItemCard key={index} interview={interview} />
            ))}
      </div>
    </div>
  );
};

export default InterviewList;