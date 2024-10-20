"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/Gemini";
import { LoaderCircle, PlusCircle } from "lucide-react";
import { AIinterview } from "@/utils/schema";
import { db } from "@/utils/db";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import moment from "moment/moment";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";

const AddNewInterview = () => {
  const [dialogBox, setDialogBox] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState([]);
  const {user} = useUser();
  const router = useRouter();
  const {darkMode} = useTheme();

  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    
    const input = `Job Position: ${jobPosition}, Job Description: ${jobDesc}, Job Experience: ${jobExperience}. Now for these job specs, generate 15 interview questions asked in real interviews in json format along with their answers .`;
  
    try {
      const result = await chatSession.sendMessage(input);
      const jsonData = result.response.text();
      console.log("Full response:", jsonData);
  
      try {
        const parsedData = JSON.parse(jsonData); 
        console.log("Parsed JSON:", parsedData);
        setJsonResponse(parsedData);
  
        if (parsedData) {
          const res = await db.insert(AIinterview).values({
            mockId: uuidv4(),
            jsonMockResp: parsedData,
            jobPosition: jobPosition,
            jobDesc: jobDesc,
            jobExperience: jobExperience,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            createdAt: moment().format("DD-MM-YYYY")
          }).returning({mockId: AIinterview.mockId});
          console.log("Inserted into DB:", res);

          if(res) {
            setDialogBox(false);
            router.push('/dashboard/interview/' + res[0] ?. mockId)
          }
        } else {
          console.log("No valid JSON data found");
        }
      } catch (jsonError) {
        console.error("Error parsing JSON:", jsonError);
      }
    } catch (error) {
      console.error("Error sending message to Gemini:", error);
    }
  
    setLoading(false);
    setDialogBox(false);
  };

  return (
    <div 
      className={`p-10 border rounded-lg ${
        darkMode 
          ? 'bg-gray-800 hover:bg-gray-700 text-white' 
          : 'bg-white hover:bg-gray-50 text-gray-900'
      } hover:shadow-lg cursor-pointer transition-all`}
      onClick={() => setDialogBox(true)}
    >
      <div className="flex flex-col items-center justify-center h-full">
        <PlusCircle className={`w-12 h-12 mb-4 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
        <h2 className={`font-bold text-2xl text-center ${darkMode ? 'text-purple-400' : 'text-purple-700'}`}>
          Add New Interview
        </h2>
      </div>

      <Dialog open={dialogBox} onOpenChange={setDialogBox}>
        <DialogContent className={`max-w-2xl ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
          <DialogHeader>
            <DialogTitle className="font-bold text-2xl">
              Create a New Mock Interview
            </DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit} className="space-y-6">
                <div>
                  <h2 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Add details about your Job position/role
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className={`block mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Job Role / Job Position
                      </label>
                      <Input
                        placeholder="Ex. FullStack developer"
                        required
                        onChange={(e) => setJobPosition(e.target.value)}
                        className={darkMode ? 'bg-gray-700 text-white' : 'bg-white'}
                      />
                    </div>
                    <div>
                      <label className={`block mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Job Description / Tech Stack
                      </label>
                      <Textarea
                        placeholder="Ex. NodeJS, ReactJS, Django, Python, JS etc"
                        required
                        onChange={(e) => setJobDesc(e.target.value)}
                        className={darkMode ? 'bg-gray-700 text-white' : 'bg-white'}
                      />
                    </div>
                    <div>
                      <label className={`block mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Years of Experience
                      </label>
                      <Input
                        placeholder="Ex. 2"
                        type="number"
                        required
                        max="50"
                        onChange={(e) => setJobExperience(e.target.value)}
                        className={darkMode ? 'bg-gray-700 text-white' : 'bg-white'}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogBox(false)}
                    className={darkMode ? 'text-gray-300 hover:text-white' : ''}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className={`${darkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-600 hover:bg-purple-700'} text-white`}
                  >
                    {loading ? (
                      <>
                        <LoaderCircle className="animate-spin mr-2" />
                        Loading interview...
                      </>
                    ) : (
                      "Start Interview"
                    )}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddNewInterview;