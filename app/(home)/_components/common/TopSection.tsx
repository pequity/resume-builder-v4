"use client";
import { useResumeContext } from "@/context/resume-info-provider";
import { AlertCircle } from "lucide-react";
import React from "react";
import ResumeTitle from "./ResumeTitle";

const TopSection = () => {
  const { resumeInfo } = useResumeContext();
  return (
    <>
      {resumeInfo?.status === "archived" && (
        <div className="absolute z-[9] inset-0 h-6 top-0 bg-rose-500 text-center text-base p-2 text-white flex items-center gap-x-2 justify-center font-medium">
          <AlertCircle size="16px" />
          This resume is in the trash bin
        </div>
      )}
      <div className="w-full flex items-center justify-between border-b pb-3 z-50">
        <div className="flex items-center gap-2">
          <ResumeTitle
            isLoading={false}
            initialTitle={resumeInfo?.title || ""}
            status={resumeInfo?.status}
            onSave={(value) => console.log(value)}
          />
        </div>
        <div className="flex items-center gap-2">
          {/* {Theme Color} */}

          {/* {Preview Model } */}

          {/* {Download Resume} */}

          {/* {More Options} */}
        </div>
      </div>
    </>
  );
};

export default TopSection;
