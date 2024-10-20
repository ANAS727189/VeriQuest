"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Calendar, Briefcase, Clock } from "lucide-react";

const InterviewItemCard = ({ interview }) => {
  const router = useRouter();
  const { darkMode } = useTheme();

  return (
    <div className={`rounded-lg overflow-hidden transition-all duration-300 ${
      darkMode 
        ? 'bg-gray-800 hover:bg-gray-700 text-white' 
        : 'bg-white hover:bg-gray-50 text-gray-900'
    } shadow-lg hover:shadow-xl`}>
      <div className="p-5">
        <h2 className={`font-bold text-xl mb-2 ${
          darkMode ? 'text-purple-400' : 'text-purple-700'
        }`}>
          {interview?.jobPosition}
        </h2>
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm">
            <Briefcase className={`w-4 h-4 mr-2 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`} />
            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              {interview?.jobExperience} Years of experience
            </span>
          </div>
          <div className="flex items-center text-xs">
            <Calendar className={`w-4 h-4 mr-2 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`} />
            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
              Created: {interview?.createdAt}
            </span>
          </div>
        </div>
        <div className="flex justify-between gap-3">
          <Button
            size="sm"
            variant="outline"
            className={`flex-1 ${
              darkMode 
                ? 'bg-gray-700 text-purple-400 hover:bg-gray-600' 
                : 'bg-gray-100 text-purple-700 hover:bg-gray-200'
            }`}
            onClick={() => router.push(`/dashboard/interview/${interview.mockId}/feedback`)}
          >
            Feedback
          </Button>
          <Button
            size="sm"
            className={`flex-1 ${
              darkMode 
                ? 'bg-purple-700 hover:bg-purple-600' 
                : 'bg-purple-600 hover:bg-purple-700'
            } text-white`}
            onClick={() => router.push(`/dashboard/interview/${interview.mockId}`)}
          >
            <Clock className="w-4 h-4 mr-2" />
            Start
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewItemCard;