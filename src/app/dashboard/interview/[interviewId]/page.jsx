"use client";

import React, { useEffect } from "react";
import { AIinterview } from "@/utils/schema";
import { db } from "@/utils/db";
import { eq } from "drizzle-orm";
import Webcam from "react-webcam";
import { WebcamIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";
import Link from 'next/link';

const Interview = ({ params }) => {
  const [interviewData, setInterviewData] = React.useState(null);
  const [webCamEnabled, setWebCamEnabled] = React.useState(false);

  useEffect(() => {
    console.log("Interview page", params.interviewId);
    GetInterviewDetail();
  }, []);

  const GetInterviewDetail = async () => {
    const res = await db
      .select()
      .from(AIinterview)
      .where(eq(AIinterview.mockId, params.interviewId));
    console.log("details: ", res);
    if (res.length > 0) {
      setInterviewData(res[0]);
    }
  };

  return (
    <div className="my-10 p-8">
      <h2 className="font-bold text-3xl">Let's get started</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex flex-col my-5 gap-5">
          {interviewData ? (
            <>
              <div className="flex flex-col p-5 rounded-lg border">
                <h2 className="text-lg">
                  <strong>Job Role/Job Position: </strong>
                  {interviewData.jobPosition}
                </h2>
                <h2 className="text-lg">
                  <strong>Job Description/Tech Stack: </strong>
                  {interviewData.jobDesc}
                </h2>
                <h2 className="text-lg">
                  <strong>Job Experience: </strong>
                  {interviewData.jobExperience}
                </h2>
              </div>

              <div className="p-5 border rounded-lg border-yellow-300 bg-yellow-200">
                <h2 className="flex gap-2 items-center text-yellow-600">
                  <Lightbulb /> <strong>Information</strong>
                </h2>
                <h2 className="mt-3 text-yellow-500">
                  {process.env.NEXT_PUBLIC_INFORMATION}
                </h2>
              </div>
            </>
          ) : (
            <p>Loading interview data...</p>
          )}
        </div>
        <div>
          {webCamEnabled ? (
            <Webcam
              style={{ height: 300, width: 300 }}
              onUserMedia={() => setWebCamEnabled(true)}
              onUserMediaError={() => setWebCamEnabled(false)}
              mirrored={true}
            />
          ) : (
            <>
              <WebcamIcon className="h-72 w-full my-7 p-20 bg-secondary rounded-lg border" />
              <Button
                variant="ghost"
                className="w-full bg-purple-800"
                onClick={() => setWebCamEnabled(true)}
              >
                Enable WebCam & microphone
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="flex justify-end items-end mt-2">
      <Link href = {'/dashboard/interview/' + params.interviewId + '/start'}>
      <Button className="bg-purple-700">Start Interview</Button>
      </Link>
      </div>
    </div>
  );
};

export default Interview;
