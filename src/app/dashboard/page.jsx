"use client";
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import AddNewInterview from './_components/AddNewInterview';
import InterviewList from './_components/InterviewList';

const Dashboard = () => {
  const { darkMode } = useTheme();

  return (
    <div className={`p-10 min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className=" mx-auto">
        <h1 className='font-bold text-3xl mb-2'>Dashboard</h1>
        <p className={`text-lg mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Create and start your own mockup interview
        </p>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-10'>
          <AddNewInterview />
        </div>

        <InterviewList />
      </div>
    </div>
  );
};

export default Dashboard;